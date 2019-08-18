export declare abstract class ConfigurationSource {
    readonly id: string;
    readonly creationTime: Date;
    readonly configurationOptions: Set<string>;
    abstract initialize(): Promise<boolean>;
    abstract close(): Promise<boolean>;
    abstract isSet(setting: string): boolean;
    abstract getBoolean(key: string): boolean | undefined;
    abstract getInteger(key: string): number | undefined;
    abstract getString(key: string): string | undefined;
    abstract queue_protocol: string;
    abstract queue_server_hostname: string;
    abstract queue_server_tcp_listening_port: number;
    abstract queue_username: string;
    abstract queue_password: string;
    abstract queue_rpc_message_timeout_in_milliseconds: number;
    static convertStringToBoolean(str: string): boolean | undefined;
    static convertStringToInteger(str: string): number | undefined;
}
//# sourceMappingURL=ConfigurationSource.d.ts.map