"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationSource_1 = require("../ConfigurationSource");
class EnvironmentVariablesConfigurationSource extends ConfigurationSource_1.ConfigurationSource {
    initialize() {
        return Promise.resolve(true);
    }
    close() {
        return Promise.resolve(true);
    }
    isSet(setting) {
        const environmentVariableName = EnvironmentVariablesConfigurationSource.transformKeyNameToEnvironmentVariableName(setting);
        if (environmentVariableName in process.env)
            return true;
        else
            return false;
    }
    getBoolean(key) {
        if (key.length === 0)
            return undefined;
        const environmentVariableName = EnvironmentVariablesConfigurationSource.transformKeyNameToEnvironmentVariableName(key);
        const environmentVariable = (environmentVariableName in process.env
            ? process.env[environmentVariableName] : undefined);
        if (!environmentVariable)
            return undefined;
        return ConfigurationSource_1.ConfigurationSource.convertStringToBoolean(environmentVariable);
    }
    getInteger(key) {
        if (key.length === 0)
            return undefined;
        const environmentVariableName = EnvironmentVariablesConfigurationSource.transformKeyNameToEnvironmentVariableName(key);
        const environmentVariable = (environmentVariableName in process.env
            ? process.env[environmentVariableName] : undefined);
        if (!environmentVariable)
            return undefined;
        return ConfigurationSource_1.ConfigurationSource.convertStringToInteger(environmentVariable);
    }
    getString(key) {
        if (key.length === 0)
            return undefined;
        const environmentVariableName = EnvironmentVariablesConfigurationSource.transformKeyNameToEnvironmentVariableName(key);
        return (environmentVariableName in process.env
            ? process.env[environmentVariableName] : undefined);
    }
    static transformKeyNameToEnvironmentVariableName(key) {
        return key.toUpperCase().replace(/\./ug, "_");
    }
    get queue_protocol() {
        const DEFAULT_VALUE = "AMQP";
        const env = this.getString("queue.protocol");
        if (!env)
            return DEFAULT_VALUE;
        return env;
    }
    get queue_server_hostname() {
        const DEFAULT_VALUE = "localhost";
        const env = this.getString("queue.server.hostname");
        if (!env)
            return DEFAULT_VALUE;
        return env;
    }
    get queue_server_tcp_listening_port() {
        const DEFAULT_VALUE = 5672;
        const env = this.getInteger("queue.server.tcp.listening_port");
        if (!env)
            return DEFAULT_VALUE;
        return env;
    }
    get queue_username() {
        const DEFAULT_VALUE = "";
        const env = this.getString("queue.username");
        if (!env)
            return DEFAULT_VALUE;
        return env;
    }
    get queue_password() {
        const DEFAULT_VALUE = "";
        const env = this.getString("queue.password");
        if (!env)
            return DEFAULT_VALUE;
        return env;
    }
    get queue_rpc_message_timeout_in_milliseconds() {
        const DEFAULT_VALUE = 10000;
        const env = this.getInteger("queue.rpc_message_timeout_in_milliseconds");
        if (!env)
            return DEFAULT_VALUE;
        return env;
    }
}
exports.EnvironmentVariablesConfigurationSource = EnvironmentVariablesConfigurationSource;
//# sourceMappingURL=EnvironmentVariables.js.map