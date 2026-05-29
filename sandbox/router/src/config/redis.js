import Redis from 'ioredis'
import { Config } from './dotenv.js'


const redis = new Redis(Config.redisUrl)

redis.on('connect', () => {
    console.log('Connected to Redis')
})
redis.on('error', (err) => {
    console.log('Redis connection error',err)
})


export async function refreshTTL(sandboxId) {
    await redis.expire(`sandbox:${sandboxId}`, 40)
}


export { redis }