import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import sandboxRouter from "./routes/sandbox.route.js"

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

app.use("/api/sandbox", sandboxRouter)



export default app