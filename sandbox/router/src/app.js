import express from "express"
import morgan from "morgan"
import { createProxyMiddleware } from "http-proxy-middleware"
const app = express()

app.use(morgan("dev"))

app.get('/api/status/healthz', (req, res) => {
    res.status(200).json({
        message: 'Router is healthy',
        status: 'ok'
    })
})

const proxies = {}

function getProxy(sandboxId){
    if (!proxies[sandboxId]) {
        proxies[sandboxId] = createProxyMiddleware({
            target: `http://sandbox-service-${sandboxId}`,
            changeOrigin: true,
            ws: true,
        })
    }
    return proxies[sandboxId]
}
app.use((req, res, next) => {
    const host = req.headers.host
    const sandboxId = host.split('.')[0]

    if (sandboxId !== 'preview') {
        return getProxy(sandboxId)(req, res, next)
    } else {
        return res.status(404).json({
            message: 'Sandbox not found'
        })
    }
})

export default app 