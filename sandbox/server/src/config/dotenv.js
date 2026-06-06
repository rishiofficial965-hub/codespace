import { config } from "dotenv"

config()

export const Config = {
    redisUrl: process.env.REDIS_URL,
    authMongoUri: process.env.AUTH_MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
}