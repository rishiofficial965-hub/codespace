import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import { createPod } from "./kubernetes/pod.js"
import { createService } from "./kubernetes/service.js"
import { v7 as uuid } from "uuid"
import { createSandboxKey } from "./config/redis.js"
import cookieParser from "cookie-parser"
dotenv.config()

const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//Routes
app.get("/api/sandbox/healthz", (req, res) => {
    res.status(200).json({ message: "Sandbox is healthy" })
})

app.get("/api/sandbox/readyz", (req, res) => {
    res.status(200).json({ message: "Sandbox is ready" })
})

app.post("/api/sandbox/start", async (req, res) => {
    const sandboxId = uuid()

    await Promise.all([
        createPod(sandboxId),
        createService(sandboxId),
        createSandboxKey(sandboxId)
    ])
    return res.status(201).json({
        message: 'Sandbox environment created successfully',
        sandboxId,
        previewUrl: `http://${sandboxId}.preview.localhost`,
        agentUrl: `http://${sandboxId}.agent.localhost`,
    })
})

export default app