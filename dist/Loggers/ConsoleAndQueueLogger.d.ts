import { Logger } from "../Logger";
import { LogLevel } from "../LogLevel";
import { Messageable } from "../Messageable";
import { MessageBroker } from "../MessageBroker";
export declare class ConsoleAndQueueLogger implements Logger {
    readonly messageBroker: MessageBroker;
    private static DEBUG_ICON;
    private static INFO_ICON;
    private static WARN_ICON;
    private static ERROR_ICON;
    consoleLogLevel: LogLevel;
    queueLogLevel: LogLevel;
    constructor(messageBroker: MessageBroker);
    initialize(): Promise<boolean>;
    close(): Promise<boolean>;
    debug(event: Messageable): void;
    info(event: Messageable): void;
    warn(event: Messageable): void;
    error(event: Messageable): void;
}
//# sourceMappingURL=ConsoleAndQueueLogger.d.ts.map