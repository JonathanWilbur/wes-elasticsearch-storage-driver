"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const es = __importStar(require("@elastic/elasticsearch"));
class StorageBackend {
    constructor() {
        this.client = new es.Client({
            node: "http://localhost:9200",
        });
    }
    async initialize() {
        const xResponse = await this.client.indices.exists({
            index: "messages",
        });
        if (xResponse.statusCode === 404) {
            await this.client.indices.create({
                index: "messages",
                body: {
                    mappings: {
                        properties: {
                            from: {
                                type: "keyword",
                            },
                            to: {
                                type: "keyword",
                            },
                            body: {
                                type: "text",
                            },
                        },
                    },
                },
            });
        }
    }
    async createMessage(event) {
        await this.client.index({
            index: "messages",
            body: event,
        });
        return Promise.resolve();
    }
}
exports.StorageBackend = StorageBackend;
const storage = new StorageBackend();
exports.default = storage;
//# sourceMappingURL=StorageBackend.js.map