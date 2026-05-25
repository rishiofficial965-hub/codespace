import express from "express"
import morgan from "morgan"
import { createPod } from "./kubernetes/pod.js"
import {createService} from "./kubernetes/service.js"
import { v7 as uuid } from "uuid";

const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.get("/api/sandbox/health", (req, res) => {
    res.status(200).json({
        message: 'Sandbox Api is healthy', status: 'ok'
    })
})


app.post("/api/sandbox/start", async (req, res) => {
    try{
        const sandboxId = uuid();
        await Promise.all([
            createPod(sandboxId),
            createService(sandboxId)
        ])
        return res.status(200).json({
            message: 'Sandbox started successfully',
            sandboxId: sandboxId,
            previewUrl: `http://${sandboxId}.preview.localhost`
        })  
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: 'Failed to start sandbox',
            error: error
        })
    }
})


export default app