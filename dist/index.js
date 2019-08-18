"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ConsoleAndQueueLogger_1 = require("./Loggers/ConsoleAndQueueLogger");
const EnvironmentVariables_1 = require("./ConfigurationSources/EnvironmentVariables");
function* pluginIterator(directoryName) {
    const directorySet = new Set(fs.readdirSync(directoryName, { encoding: "utf8", }));
    for (const entry of directorySet.values()) {
        const fullEntryPath = path.join(directoryName, entry);
        const stat = fs.statSync(fullEntryPath);
        if (stat.isDirectory()) {
            const subdirectory = pluginIterator(fullEntryPath);
            let iteration = subdirectory.next();
            while (!iteration.done) {
                yield iteration.value;
                iteration = subdirectory.next();
            }
        }
        else if (fullEntryPath.endsWith(".js") && stat.isFile())
            yield fullEntryPath;
    }
}
(async () => {
    const configuration = new EnvironmentVariables_1.EnvironmentVariablesConfigurationSource();
    await configuration.initialize();
    for (const option of configuration.configurationOptions.values()) {
        if (configuration.isSet(option) && console) {
            console.log(`Configuration option ${option} is set to '${configuration.getString(option)}'.`);
        }
    }
    const messageBrokersDirectory = path.join(__dirname, "MessageBrokers");
    const messageBrokerProtocols = {};
    const messageBrokerPluginsIterator = pluginIterator(messageBrokersDirectory);
    for (const plugin of messageBrokerPluginsIterator) {
        const protocolName = path.basename(plugin).replace(/\.js$/u, "").toUpperCase();
        messageBrokerProtocols[protocolName] = plugin;
        if (console)
            console.log(`Found (but not yet loaded) message broker plugin for protocol '${protocolName}'.`);
    }
    const queueProtocol = configuration.queue_protocol.toUpperCase();
    if (!(queueProtocol in messageBrokerProtocols)) {
        if (console)
            console.error(`No message broker plugin is available for the protocol '${queueProtocol}'.`);
        if (console)
            console.error(`Your choices are: ${Object.keys(messageBrokerProtocols).join(", ")}.`);
        process.exit(1);
    }
    const messageBroker = new (require(messageBrokerProtocols[queueProtocol]).default)(configuration);
    await messageBroker.initialize();
    if (console) {
        console.log(`Loaded message broker plugin for protocol '${queueProtocol}'.`);
    }
    const logger = new ConsoleAndQueueLogger_1.ConsoleAndQueueLogger(messageBroker);
    await logger.initialize();
})();
//# sourceMappingURL=index.js.map