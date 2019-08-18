import { URL } from "url";
import { UniquelyIdentified } from "wildboar-microservices-ts";
import { ConfigurationSource } from "../ConfigurationSource";
import { MessageBroker } from "../MessageBroker";
export default class AMQPMessageBroker implements MessageBroker, UniquelyIdentified {
    readonly configuration: ConfigurationSource;
    readonly id: string;
    readonly creationTime: Date;
    readonly protocol: string;
    private connection;
    private channel;
    readonly queueURI: URL;
    constructor(configuration: ConfigurationSource);
    initialize(): Promise<boolean>;
    publishEvent(topic: string, message: object): void;
    closeConnection(): Promise<boolean>;
}
//# sourceMappingURL=AMQP.d.ts.map