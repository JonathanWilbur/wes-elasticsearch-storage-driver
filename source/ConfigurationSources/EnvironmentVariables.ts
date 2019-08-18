import { ConfigurationSource, } from "../ConfigurationSource";

export
class EnvironmentVariablesConfigurationSource extends ConfigurationSource {
    public initialize (): Promise<boolean> {
        return Promise.resolve(true);
    }

    public close (): Promise<boolean> {
        return Promise.resolve(true);
    }

    isSet (setting: string): boolean {
        const environmentVariableName: string
            = EnvironmentVariablesConfigurationSource.transformKeyNameToEnvironmentVariableName(setting);
        if (environmentVariableName in process.env) return true;
        else return false;
    }

    public getBoolean (key: string): boolean | undefined {
        if (key.length === 0) return undefined;
        const environmentVariableName: string
            = EnvironmentVariablesConfigurationSource.transformKeyNameToEnvironmentVariableName(key);
        const environmentVariable: string | undefined
            = (environmentVariableName in process.env
                ? process.env[environmentVariableName] : undefined);
        if (!environmentVariable) return undefined;
        return ConfigurationSource.convertStringToBoolean(environmentVariable);
    }

    public getInteger (key: string): number | undefined {
        if (key.length === 0) return undefined;
        const environmentVariableName: string
            = EnvironmentVariablesConfigurationSource.transformKeyNameToEnvironmentVariableName(key);
        const environmentVariable: string | undefined
            = (environmentVariableName in process.env
                ? process.env[environmentVariableName] : undefined);
        if (!environmentVariable) return undefined;
        return ConfigurationSource.convertStringToInteger(environmentVariable);
    }

    public getString (key: string): string | undefined {
        if (key.length === 0) return undefined;
        const environmentVariableName: string
            = EnvironmentVariablesConfigurationSource.transformKeyNameToEnvironmentVariableName(key);
        return (environmentVariableName in process.env
            ? process.env[environmentVariableName] : undefined);
    }

    public static transformKeyNameToEnvironmentVariableName (key: string): string {
        return key.toUpperCase().replace(/\./ug, "_");
    }

    /**
     * The specific directive accessors go below here.
     */

    get queue_protocol (): string {
        const DEFAULT_VALUE = "AMQP";
        const env: string | undefined = this.getString("queue.protocol");
        if (!env) return DEFAULT_VALUE;
        return env;
    }

    get queue_server_hostname (): string {
        const DEFAULT_VALUE = "localhost";
        const env: string | undefined = this.getString("queue.server.hostname");
        if (!env) return DEFAULT_VALUE;
        return env;
    }

    get queue_server_tcp_listening_port (): number {
        const DEFAULT_VALUE = 5672;
        const env: number | undefined = this.getInteger("queue.server.tcp.listening_port");
        if (!env) return DEFAULT_VALUE;
        return env;
    }

    get queue_username (): string {
        const DEFAULT_VALUE = "";
        const env: string | undefined = this.getString("queue.username");
        if (!env) return DEFAULT_VALUE;
        return env;
    }

    get queue_password (): string {
        const DEFAULT_VALUE = "";
        const env: string | undefined = this.getString("queue.password");
        if (!env) return DEFAULT_VALUE;
        return env;
    }

    get queue_rpc_message_timeout_in_milliseconds (): number {
        const DEFAULT_VALUE = 10000;
        const env: number | undefined = this.getInteger("queue.rpc_message_timeout_in_milliseconds");
        if (!env) return DEFAULT_VALUE;
        return env;
    }
}
