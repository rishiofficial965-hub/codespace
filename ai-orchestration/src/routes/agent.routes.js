import { Router } from "express";
import codeAgent from "../agents/code.agent.js"
import { HumanMessage } from "@langchain/core/messages";

const agentRouter = Router();

agentRouter.post("/invoke", async (req, res) => {
    try {
        const { prompt } = req.body;
        const result = await codeAgent.invoke({
            messages: [
                new HumanMessage(prompt)
            ],
        })
        res.json({result})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" })
    }
})



export default agentRouter