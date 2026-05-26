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
const agentProxies = {}

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

function getAgentProxy(sandboxId) {
    if (agentProxies[sandboxId]) {
        return agentProxies[sandboxId]
    }
    const targetUrl = `http://sandbox-service-${sandboxId}:3000`
    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        ws: true
    })
    agentProxies[sandboxId] = proxy
    return proxy
}

app.use((req, res, next) => {
    const host = req.headers.host
    const parts = host.split('.')

    const sandboxId = parts[0]
    const routeType = parts[1]

    if (routeType === 'agent') {
        return getAgentProxy(sandboxId)(req, res, next)
    }
    else if (routeType === 'preview') {
        return getProxyMiddleware(sandboxId)(req, res, next)
    }
    return res.status(400).send('Bad Request')
})

export default app