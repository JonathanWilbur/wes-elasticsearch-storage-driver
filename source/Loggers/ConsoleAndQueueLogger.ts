import { Logger, } from "../Logger";
import { LogLevel, } from "../LogLevel";
import { Messageable, } from "../Messageable";
import { MessageBroker, } from "../MessageBroker";

// REVIEW: The problem with this is that there is no way of reliably indicating
// which server a message came from.
// Maybe pass the message broker in the constructor?
// And set the server UUID in the messageBroker.
export
class ConsoleAndQueueLogger implements Logger {
    private static DEBUG_ICON = "(?)";
    private static INFO_ICON = "(i)";
    private static WARN_ICON = "<!>";
    private static ERROR_ICON = "[X]";
    public consoleLogLevel: LogLevel = LogLevel.INFO;
    public queueLogLevel: LogLevel = LogLevel.INFO;

    constructor (
        readonly messageBroker: MessageBroker
    ) {}

    public initialize (): Promise<boolean> {
        return Promise.resolve(true);
    }

    public async close (): Promise<boolean> {
        return Promise.resolve(true);
    }

    public debug (event: Messageable): void {
        if (console && (this.consoleLogLevel <= LogLevel.DEBUG)) {
            console.debug(`${ConsoleAndQueueLogger.DEBUG_ICON} ${event.message}`);
        }
        if (this.queueLogLevel <= LogLevel.DEBUG) {
            (event as any).severity = "DEBUG";
            if (event.topic) this.messageBroker.publishEvent(event.topic, event);
            else this.messageBroker.publishEvent("storage", event);
        }
    }

    public info (event: Messageable): void {
        if (console && (this.consoleLogLevel <= LogLevel.INFO)) {
            console.info(`${ConsoleAndQueueLogger.INFO_ICON} ${event.message}`);
        }
        if (this.queueLogLevel <= LogLevel.INFO) {
            (event as any).severity = "INFO";
            if (event.topic) this.messageBroker.publishEvent(event.topic, event);
            else this.messageBroker.publishEvent("storage", event);
        }
    }

    public warn (event: Messageable): void {
        if (console && (this.consoleLogLevel <= LogLevel.WARN)) {
            console.warn(`${ConsoleAndQueueLogger.WARN_ICON} ${event.message}`);
        }
        if (this.queueLogLevel <= LogLevel.WARN) {
            (event as any).severity = "WARN";
            if (event.topic) this.messageBroker.publishEvent(event.topic, event);
            else this.messageBroker.publishEvent("storage", event);
        }
    }

    public error (event: Messageable): void {
        if (console && (this.consoleLogLevel <= LogLevel.ERROR)) {
            console.error(`${ConsoleAndQueueLogger.ERROR_ICON} ${event.message}`);
        }
        if (this.queueLogLevel <= LogLevel.ERROR) {
            (event as any).severity = "ERROR";
            this.messageBroker.publishEvent("storage.error", event);
        }
    }
}
