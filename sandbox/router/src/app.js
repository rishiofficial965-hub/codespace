import express from "express"
import morgan from "morgan"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/api/status/healthz', (req, res) => {
    return res.json({ message: "All good" })
})

app.get('/api/status/readyz', (req, res) => {
    return res.json({ message: "All good" })
})

const proxies = {}

function getProxyMiddleware(sandboxId) {
    if (proxies[sandboxId]) {
        return proxies[sandboxId]
    }

    const targetUrl = `http://sandbox-service-${sandboxId}:80`
    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        ws: true
    })

    proxies[sandboxId] = proxy
    return proxy
}

app.use((req, res, next) => {
    const host = req.headers.host
    const sandboxId = host.split('.')[0]
    return getProxyMiddleware(sandboxId)(req, res, next)
})

export default app