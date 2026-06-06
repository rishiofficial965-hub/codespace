import { config } from "dotenv";

config()

export const Config = {
    brevoApiKey: process.env.BREVO_API_KEY,
    brevoSenderEmail: process.env.BREVO_SENDER_EMAIL,
    rabbitMqUrl: process.env.RABBITMQ_URL,
    rabbitMqPort: process.env.RABBITMQ_PORT
}