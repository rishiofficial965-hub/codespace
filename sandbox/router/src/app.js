import express from "express"
import morgan from "morgan"
import { createProxyMiddleware } from "http-proxy-middleware"
const app = express()

app.use(morgan("dev"))

app.use((req, res, next) => {
    const host = req.headers.host
    const sandboxId = host.split('.')[0]

    if (sandboxId !== 'preview') {
        const serviceUrl = `http://sandox-service-${sandboxId}`

        return createProxyMiddleware({
            target: serviceUrl,
            changeOrigin: true,
            ws: true,
        })(req, res, next)

    } else {
        return res.status(404).json({
            message: 'Sandbox not found'
        })
    }
})

app.get('api/status/healthz', (req, res) => {
    res.status(200).json({
        message: 'Router is healthy',
        status: 'ok'
    })
})

export default app 