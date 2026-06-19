import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js"
import { startSandbox } from "../controllers/sandbox.controllers.js";
const router = Router()

router.post("/start", authMiddleware, startSandbox)

export default router