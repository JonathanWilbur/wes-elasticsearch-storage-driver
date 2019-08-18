import * as es from "@elastic/elasticsearch";

// export default
// interface StorageBackend {
//     createMessage (): Promise<void>;
//     // readMessage (): Promise<any>;
//     // updateMessage (): Promise<void>;
//     // deleteMessage (): Promise<void>;
//     // createFolder (): Promise<void>;
//     // readFolder (): Promise<void>;
//     // updateFolder (): Promise<void>;
//     // deleteFolder (): Promise<void>;
//     // searchMessages (): Promise<any[]>;
// };

export
class StorageBackend {
    private client!: es.Client;

    constructor () {
        this.client = new es.Client({
            node: "http://localhost:9200",
        });
    }

    public async initialize (): Promise<void> {
        const xResponse: es.ApiResponse = await this.client.indices.exists({
            index: "messages",
        });
        if (xResponse.statusCode === 404) {
            // It does not exist.
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

    public async createMessage (event: any): Promise<void> {
        await this.client.index({
            index: "messages",
            body: event,
        });
        return Promise.resolve();
    }
}

const storage: StorageBackend = new StorageBackend();
export default storage;
