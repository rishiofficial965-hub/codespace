import { response, Router } from "express";
import codeAgent from "../agents/code.agent.js";
import { HumanMessage } from "@langchain/core/messages";

const agentRouter = Router();

agentRouter.post("/invoke", async (req, res) => {
    try {
        const { prompt, projectId } = req.body;

        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        })

        const stream = await codeAgent.stream(
            {
                messages: [
                    new HumanMessage(prompt)
                ]
            },
            {
                configurable: {
                    projectId
                },
                writer: (text) => {
                    res.write(`data: ${JSON.stringify({ type: "writer", content: text })}\n\n`);
                },
                streamMode: "custom"
            }
        );

        for await (const chunk of stream) {
            console.log(chunk);

            res.write(`data: ${JSON.stringify(chunk)}\n\n`)
        }

        res.end();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

export default agentRouter;