import express from "express";
import morgan from "morgan";
import {
    listFileController,
    readFileController,
    updateFileController,
    createFileController,
    deleteController
} from "./controllers/app.controllers.js";

const app = express();

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to Capstone Agent API",
        success: true,
    });
})

app.get("/list-files", listFileController)

app.get("/read-files", readFileController)

app.patch("/update-files", updateFileController)

app.post("/create-files", createFileController)

app.delete("/delete-path", deleteController)

export default app;