import { createPod } from "../kubernetes/pod.js"
import { createService } from "../kubernetes/service.js"
import { v7 as uuid } from "uuid"
import { createSandboxKey } from "../config/redis.js"
import Project from "../model/project.model.js";


export async function startSandbox(req, res) {
    const sandboxId = uuid()
    const projectId = req.body.projectId

    const project = await Project.findOne(projectId)
    if (!project) {
        return res.status(404).json({ message: "Project not found" })
    }

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
}