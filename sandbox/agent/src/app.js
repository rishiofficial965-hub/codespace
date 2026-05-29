import express from "express";
import morgan from "morgan";
import {
    listFileController,
    readFileController,
    updateFileController,
    createFileController,
    deleteController
} from "./controllers/app.controllers.js";
import { Server } from "socket.io";
import http from "http";
import pty from "node-pty"
import os from "os"
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to Capstone Agent API",
        success: true,
    });
})

const shell = os.platform() === "win32" ? "powershell.exe" : "bash"

const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-256color",
    cols: 80,
    rows: 30,
    cwd: "/workspace",
    env: process.env
})

ptyProcess.onData((data) => {
    io.emit('terminal-output', data)
})

ptyProcess.onExit(({ exitCode, signal }) => {
    io.emit('terminal-exit', { exitCode, signal })
})

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("terminal-input", (input) => {
        ptyProcess.write(input)
    })
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);

    })
})

app.get("/list-files", listFileController)
    
app.get("/read-files", readFileController)

app.patch("/update-files", updateFileController)

app.post("/create-files", createFileController)

app.delete("/delete-path", deleteController)

export default httpServer;