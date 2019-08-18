export declare class StorageBackend {
    private client;
    constructor();
    initialize(): Promise<void>;
    createMessage(event: any): Promise<void>;
}
declare const storage: StorageBackend;
export default storage;
//# sourceMappingURL=StorageBackend.d.ts.map