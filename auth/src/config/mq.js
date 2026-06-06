import amqplib from "amqplib";
import { Config } from "./dotenv.js";

const QUEUE = 'auth_notification_queue';
const OTP_QUEUE = "otp_queue";

const url = Config.rabbitmqUrl;
const connection = await amqplib.connect(url);

const channel = await connection.createChannel();

channel.assertQueue(QUEUE, { durable: true })

export async function sendAuthNotification(message) {
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), {
        persistent: true
    })
}

channel.assertQueue(OTP_QUEUE, {durable: true});

export async function sendOTPNotification(message) {
    channel.sendToQueue(OTP_QUEUE, Buffer.from(JSON.stringify(message)), {
        persistent: true
    })
}