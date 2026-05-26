import express from "express";
import morgan from "morgan";
import fs from "fs"

const WORKDIR = "/workspace"
const app = express();

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Capstone Agent API",
        success: true,
    });
})

app.get("/list-files", async (req, res) => {
    try {
        const elements = await fs.promises.readdir(WORKDIR)
        res.status(200).json({
            message: "Files fetched successfully",
            success: true,
            elements
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch files",
            error: error.message
        })
    }
})

export default app;