import { config } from "dotenv"

config()

export const Config = {
    redisUrl : process.env.REDIS_URL
}