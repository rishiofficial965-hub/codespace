import express from "express"
import morgan from "morgan"

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))



app.post("/api/ai/healthz", (req, res) => {
    res.status(200).json({ message: "AI Orchestrator is healthy" })
})
app.post("/api/ai/readyz", (req, res) => {
    res.status(200).json({ message: "AI Orchestrator is ready" })
})



export default app
