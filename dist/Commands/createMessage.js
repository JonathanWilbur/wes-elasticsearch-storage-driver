"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StorageBackend_1 = __importDefault(require("../StorageBackend"));
function createMessage(event) {
    return StorageBackend_1.default.createMessage(event);
}
exports.default = createMessage;
//# sourceMappingURL=createMessage.js.map