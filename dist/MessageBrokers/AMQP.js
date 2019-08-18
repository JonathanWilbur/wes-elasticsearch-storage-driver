"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const url_1 = require("url");
const uuid_1 = require("uuid");
const createMessage_1 = __importDefault(require("../Commands/createMessage"));
const promise_retry_1 = __importDefault(require("promise-retry"));
class AMQPMessageBroker {
    constructor(configuration) {
        this.configuration = configuration;
        this.id = `urn:uuid:${uuid_1.v4()}`;
        this.creationTime = new Date();
        this.protocol = "amqp";
    }
    get queueURI() {
        return new url_1.URL(this.protocol + "://"
            + this.configuration.queue_server_hostname + ":"
            + this.configuration.queue_server_tcp_listening_port.toString());
    }
    async initialize() {
        await promise_retry_1.default(async (retry, number) => {
            if (console) {
                console.log(`Attempt #${number} to establish connection to message broker.`);
            }
            try {
                this.connection = await amqplib_1.connect({
                    hostname: this.configuration.queue_server_hostname,
                    port: this.configuration.queue_server_tcp_listening_port,
                    protocol: "amqp",
                });
            }
            catch (e) {
                retry(e);
            }
        }, {
            retries: 30,
        });
        this.channel = await this.connection.createChannel();
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
        await this.channel.consume("storage.elasticsearch.create-message", (message) => {
            if (!message) {
                return Promise.reject(new Error("Message was null."));
            }
            return createMessage_1.default(message.content);
        }, {
            noAck: true,
        });
        return Promise.resolve(true);
    }
    publishEvent(topic, message) {
        this.channel.publish("events", topic, Buffer.from(JSON.stringify(message)));
    }
    async closeConnection() {
        await this.channel.close();
        await this.connection.close();
        return Promise.resolve(true);
    }
}
exports.default = AMQPMessageBroker;
//# sourceMappingURL=AMQP.js.map