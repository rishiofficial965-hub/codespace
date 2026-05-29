import Redis from 'ioredis'
import { Config } from './dotenv.js'
import {
    deletePod,
    deleteService
} from '../kubernetes/pod.js'

const redis = new Redis(Config.redisUrl)

redis.on('connect', () => {
    console.log('Connected to Redis')
})
redis.on('error', (err) => {
    console.log('Redis connection error',err)
})

const subscriber = new Redis(Config.redisUrl)

export async function createSandboxKey(sandboxId) {
    await redis.set(`sandbox:${sandboxId}`, JSON.stringify({
        status: 'active'
    }), 'EX', 10*60)
}

subscriber.config('SET', 'notify-keyspace-events', 'Ex')

subscriber.subscribe('__keyevent@0__:expired')

subscriber.on('message', async (channel, key) => {
    console.log(`key expired :${key}`)
    const sandboxId = key.split(':')[1]
    await Promise.all([
        deletePod(sandboxId),
        deleteService(sandboxId)
    ])
})

export { redis, subscriber }