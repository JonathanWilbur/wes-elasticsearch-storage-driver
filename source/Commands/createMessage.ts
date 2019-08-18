import storage from "../StorageBackend";

export default
function createMessage (event: any): Promise<void> {
    return storage.createMessage(event);
}
