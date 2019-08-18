import { connect, Channel, Connection, ConsumeMessage, } from "amqplib";
import { URL, } from "url";
import { UniquelyIdentified, } from "wildboar-microservices-ts";
import { ConfigurationSource, } from "../ConfigurationSource";
import { MessageBroker, } from "../MessageBroker";
import { v4 as uuidv4, } from "uuid";
import createMessage from "../Commands/createMessage";
import promiseRetry from "promise-retry";

export default
class AMQPMessageBroker implements MessageBroker, UniquelyIdentified {
    public readonly id: string = `urn:uuid:${uuidv4()}`;
    public readonly creationTime: Date = new Date();
    public readonly protocol: string = "amqp";
    private connection!: Connection;
    private channel!: Channel;
    public get queueURI (): URL {
        return new URL(
            this.protocol + "://"
            + this.configuration.queue_server_hostname + ":"
            + this.configuration.queue_server_tcp_listening_port.toString()
        );
    }

    constructor (
        readonly configuration: ConfigurationSource,
    ) {}

    public async initialize (): Promise<boolean> {

        await promiseRetry(async (retry, number) => {
            if (console) {
                console.log(`Attempt #${number} to establish connection to message broker.`);
            }
            try {
                this.connection = await connect({
                    hostname: this.configuration.queue_server_hostname,
                    port: this.configuration.queue_server_tcp_listening_port,
                    // username: this.configuration.queue_username,
                    // password: this.configuration.queue_password,
                    protocol: "amqp",
                });
            } catch (e) {
                retry(e);
            }
        }, {
            retries: 30,
        });

        this.channel = await this.connection.createChannel();

        // REVIEW: Does this queue structure actually make sense, since the SMTP/IMAP servers
        // are not going to pick and choose storage drivers?
        await this.channel.assertExchange("storage", "topic", { durable: true, });
        await this.channel.assertQueue("storage.elasticsearch.create-message", { durable: false, });
        await this.channel.assertQueue("storage.elasticsearch.read-message", { durable: false, });
        await this.channel.assertQueue("storage.elasticsearch.update-message", { durable: false, });
        await this.channel.assertQueue("storage.elasticsearch.delete-message", { durable: false, });
        await this.channel.assertQueue("storage.elasticsearch.create-folder", { durable: false, });
        await this.channel.assertQueue("storage.elasticsearch.read-folder", { durable: false, });
        await this.channel.assertQueue("storage.elasticsearch.update-folder", { durable: false, });
        await this.channel.assertQueue("storage.elasticsearch.delete-folder", { durable: false, });
        await this.channel.assertQueue("storage.elasticsearch.search", { durable: false, });
        await this.channel.bindQueue("storage.elasticsearch.create-message", "storage", "create-message");
        await this.channel.bindQueue("storage.elasticsearch.read-message", "storage", "read-message");
        await this.channel.bindQueue("storage.elasticsearch.update-message", "storage", "update-message");
        await this.channel.bindQueue("storage.elasticsearch.delete-message", "storage", "delete-message");
        await this.channel.bindQueue("storage.elasticsearch.create-folder", "storage", "create-folder");
        await this.channel.bindQueue("storage.elasticsearch.read-folder", "storage", "read-folder");
        await this.channel.bindQueue("storage.elasticsearch.update-folder", "storage", "update-folder");
        await this.channel.bindQueue("storage.elasticsearch.delete-folder", "storage", "delete-folder");
        await this.channel.bindQueue("storage.elasticsearch.search", "storage", "search");

        await this.channel.assertExchange("events", "topic", { durable: true, });
        await this.channel.assertQueue("events.storage", { durable: false, });
        await this.channel.bindQueue("events.storage", "events", "storage");

        await this.channel.consume("storage.elasticsearch.create-message",
            (message: ConsumeMessage | null): Promise<void> => {
                // From the AMQPlib documentation:
                // "If the consumer is cancelled by RabbitMQ, the message callback will be invoked with null."
                // (http://www.squaremobius.net/amqp.node/channel_api.html#channel_consume)
                if (!message) {
                    return Promise.reject(new Error("Message was null."));
                }
                return createMessage(message.content);
            }, {
                noAck: true,
            }
        );

        return Promise.resolve(true);
    }

    public publishEvent (topic: string, message: object): void {
        this.channel.publish("events", topic, Buffer.from(JSON.stringify(message)));
    }

    public async closeConnection (): Promise<boolean> {
        await this.channel.close();
        await this.connection.close();
        return Promise.resolve(true);
    }
}
