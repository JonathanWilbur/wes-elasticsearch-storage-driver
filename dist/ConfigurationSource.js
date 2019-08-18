"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class ConfigurationSource {
    constructor() {
        this.id = `urn:uuid:${uuid_1.v4()}`;
        this.creationTime = new Date();
        this.configurationOptions = new Set([
            "queue.protocol",
            "queue.server.hostname",
            "queue.server.tcp.listening_port",
            "queue.username",
            "queue.password",
            "queue.rpc_message_timeout_in_milliseconds",
        ]);
    }
    static convertStringToBoolean(str) {
        if (/^\s*True\s*$/ui.test(str))
            return true;
        if (/^\s*False\s*$/ui.test(str))
            return false;
        if (/^\s*Yes\s*$/ui.test(str))
            return true;
        if (/^\s*No\s*$/ui.test(str))
            return false;
        if (/^\s*T\s*$/ui.test(str))
            return true;
        if (/^\s*F\s*$/ui.test(str))
            return false;
        if (/^\s*Y\s*$/ui.test(str))
            return true;
        if (/^\s*N\s*$/ui.test(str))
            return false;
        if (/^\s*1\s*$/ui.test(str))
            return true;
        if (/^\s*0\s*$/ui.test(str))
            return false;
        if (/^\s*\+\s*$/ui.test(str))
            return true;
        if (/^\s*-\s*$/ui.test(str))
            return false;
        return undefined;
    }
    static convertStringToInteger(str) {
        try {
            const ret = Number.parseInt(str, 10);
            if (Number.isNaN(ret))
                return undefined;
            if (!Number.isSafeInteger(ret))
                return undefined;
            return ret;
        }
        catch (e) {
            return undefined;
        }
    }
}
exports.ConfigurationSource = ConfigurationSource;
//# sourceMappingURL=ConfigurationSource.js.map