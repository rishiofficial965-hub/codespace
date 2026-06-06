import amqplib from "amqplib";
import { Config } from "./dotenv.js";

const QUEUE = 'auth_notification_queue';
const url = Config.rabbitmqUrl;
const connection = await amqplib.connect(url);

const channel = await connection.createChannel();

channel.assertQueue(QUEUE, { durable: true })

export async function sendAuthNotification(message) {
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), {
        persistent: true
    })
}