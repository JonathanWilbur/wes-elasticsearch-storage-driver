export interface MessageBroker {
    initialize(): Promise<boolean>;
    publishEvent(topic: string, message: object): void;
    closeConnection(): Promise<boolean>;
}
//# sourceMappingURL=MessageBroker.d.ts.map