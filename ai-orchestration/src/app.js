import express from "express"
import morgan from "morgan"
import agentRouter from "./routes/agent.routes.js"
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

app.get("/api/ai/healthz", (req, res) => {
    res.status(200).json({ message: "AI Orchestrator is healthy" })
})
app.get("/api/ai/readyz", (req, res) => {
    res.status(200).json({ message: "AI Orchestrator is ready" })
})
app.use("/api/ai/agent", agentRouter)

export default app
