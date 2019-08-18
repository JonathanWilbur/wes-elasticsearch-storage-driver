import * as fs from "fs";
import * as path from "path";
import { ConfigurationSource, } from "./ConfigurationSource";
import { ConsoleAndQueueLogger, } from "./Loggers/ConsoleAndQueueLogger";
import { EnvironmentVariablesConfigurationSource, } from "./ConfigurationSources/EnvironmentVariables";
import { Logger, } from "./Logger";
import { MessageBroker, } from "./MessageBroker";

function *pluginIterator (directoryName: string): IterableIterator<string> {
    const directorySet: Set<string> = new Set<string>(fs.readdirSync(directoryName, { encoding: "utf8", }));
    for (const entry of directorySet.values()) {
        const fullEntryPath: string = path.join(directoryName, entry);
        const stat: fs.Stats = fs.statSync(fullEntryPath);
        if (stat.isDirectory()) {
            const subdirectory = pluginIterator(fullEntryPath);
            let iteration = subdirectory.next();
            while (!iteration.done) {
                yield iteration.value;
                iteration = subdirectory.next();
            }
        } else if (fullEntryPath.endsWith(".js") && stat.isFile()) yield fullEntryPath;
    }
}

(async (): Promise<void> => {
    const configuration: ConfigurationSource
        = new EnvironmentVariablesConfigurationSource();
    await configuration.initialize();

    for (const option of configuration.configurationOptions.values()) {
        if (configuration.isSet(option) && console) {
            console.log(`Configuration option ${option} is set to '${configuration.getString(option)}'.`);
        }
    }

    // Loading the message broker plugins
    const messageBrokersDirectory: string = path.join(__dirname, "MessageBrokers");
    const messageBrokerProtocols: { [ protocolName: string ]: string } = {};
    const messageBrokerPluginsIterator = pluginIterator(messageBrokersDirectory);
    for (const plugin of messageBrokerPluginsIterator) {
        const protocolName: string = path.basename(plugin).replace(/\.js$/u, "").toUpperCase();
        messageBrokerProtocols[protocolName] = plugin;
        if (console) console.log(`Found (but not yet loaded) message broker plugin for protocol '${protocolName}'.`);
    }

    // Initializing the chosen message broker plugin
    const queueProtocol: string = configuration.queue_protocol.toUpperCase();
    if (!(queueProtocol in messageBrokerProtocols)) {
        if (console) console.error(`No message broker plugin is available for the protocol '${queueProtocol}'.`);
        if (console) console.error(`Your choices are: ${Object.keys(messageBrokerProtocols).join(", ")}.`);
        process.exit(1);
    }
    const messageBroker: MessageBroker
        = new (require(messageBrokerProtocols[queueProtocol]).default)(configuration);
    await messageBroker.initialize();
    if (console) {
        console.log(`Loaded message broker plugin for protocol '${queueProtocol}'.`);
    }

    const logger: Logger = new ConsoleAndQueueLogger(messageBroker);
    await logger.initialize();
})();
