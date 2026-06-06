import amqplib from "amqplib";
import { Config } from "./dotenv.js";

const QUEUE = 'auth_notification_queue';
const url = Config.rabbitMqUrl;
const connection = await amqplib.connect(url);

const channel = await connection.createChannel();

channel.assertQueue(QUEUE, { durable: true })

export default channel;