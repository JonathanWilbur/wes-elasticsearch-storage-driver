// import { Temporal, UniquelyIdentified, TypedKeyValueStore, } from "wildboar-microservices-ts";
// import { TypedKeyValueStore, } from "./TypedKeyValueStore";
import { v4 as uuidv4, } from "uuid";

export
abstract class ConfigurationSource /* implements Temporal, TypedKeyValueStore, UniquelyIdentified */ {
    public readonly id: string = `urn:uuid:${uuidv4()}`;
    public readonly creationTime: Date = new Date();

    public readonly configurationOptions: Set<string> = new Set<string>([
        "queue.protocol",
        "queue.server.hostname",
        "queue.server.tcp.listening_port",
        "queue.username",
        "queue.password",
        "queue.rpc_message_timeout_in_milliseconds",
    ]);

    public abstract initialize (): Promise<boolean>;
    public abstract close (): Promise<boolean>;
    public abstract isSet (setting: string): boolean;
    public abstract getBoolean (key: string): boolean | undefined;
    public abstract getInteger (key: string): number | undefined;
    public abstract getString (key: string): string | undefined;
    public abstract queue_protocol: string;
    public abstract queue_server_hostname: string;
    public abstract queue_server_tcp_listening_port: number;
    public abstract queue_username: string;
    public abstract queue_password: string;
    public abstract queue_rpc_message_timeout_in_milliseconds: number;

    public static convertStringToBoolean (str: string): boolean | undefined {
        if (/^\s*True\s*$/ui.test(str)) return true;
        if (/^\s*False\s*$/ui.test(str)) return false;
        if (/^\s*Yes\s*$/ui.test(str)) return true;
        if (/^\s*No\s*$/ui.test(str)) return false;
        if (/^\s*T\s*$/ui.test(str)) return true;
        if (/^\s*F\s*$/ui.test(str)) return false;
        if (/^\s*Y\s*$/ui.test(str)) return true;
        if (/^\s*N\s*$/ui.test(str)) return false;
        if (/^\s*1\s*$/ui.test(str)) return true;
        if (/^\s*0\s*$/ui.test(str)) return false;
        if (/^\s*\+\s*$/ui.test(str)) return true;
        if (/^\s*-\s*$/ui.test(str)) return false;
        return undefined;
    }

    public static convertStringToInteger (str: string): number | undefined {
        try {
            const ret: number = Number.parseInt(str, 10);
            if (Number.isNaN(ret)) return undefined;
            if (!Number.isSafeInteger(ret)) return undefined;
            return ret;
        } catch (e) {
            return undefined;
        }
    }
}
