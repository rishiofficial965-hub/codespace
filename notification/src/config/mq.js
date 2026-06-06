import amqplib from "amqplib";
import { Config } from "./dotenv.js";

const QUEUE = 'auth_notification_queue';
const OTP_QUEUE = "otp_queue";

const url = Config.rabbitMqUrl;
const connection = await amqplib.connect(url);

const channel = await connection.createChannel();

// Assert queues asynchronously to ensure they exist on broker
await channel.assertQueue(QUEUE, { durable: true });
await channel.assertQueue(OTP_QUEUE, { durable: true });
    
export default channel;
