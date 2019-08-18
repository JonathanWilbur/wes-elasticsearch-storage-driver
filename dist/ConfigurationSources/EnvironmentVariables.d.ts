import { ConfigurationSource } from "../ConfigurationSource";
export declare class EnvironmentVariablesConfigurationSource extends ConfigurationSource {
    initialize(): Promise<boolean>;
    close(): Promise<boolean>;
    isSet(setting: string): boolean;
    getBoolean(key: string): boolean | undefined;
    getInteger(key: string): number | undefined;
    getString(key: string): string | undefined;
    static transformKeyNameToEnvironmentVariableName(key: string): string;
    readonly queue_protocol: string;
    readonly queue_server_hostname: string;
    readonly queue_server_tcp_listening_port: number;
    readonly queue_username: string;
    readonly queue_password: string;
    readonly queue_rpc_message_timeout_in_milliseconds: number;
}
//# sourceMappingURL=EnvironmentVariables.d.ts.map