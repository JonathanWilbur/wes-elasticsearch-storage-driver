import { Logger } from "../Logger";
import { Messageable } from "../Messageable";
export declare class ConsoleLogger implements Logger {
    private static DEBUG_ICON;
    private static INFO_ICON;
    private static WARN_ICON;
    private static ERROR_ICON;
    initialize(): Promise<boolean>;
    close(): Promise<boolean>;
    debug(event: Messageable): void;
    info(event: Messageable): void;
    warn(event: Messageable): void;
    error(event: Messageable): void;
}
//# sourceMappingURL=ConsoleLogger.d.ts.map