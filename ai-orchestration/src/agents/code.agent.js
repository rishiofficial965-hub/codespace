import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent } from "langchain";
import { listFiles, createFile, updateFile, deleteFile, readFile } from "./tools.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Config } from "../config/config.js";

const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: Config.mistral.apiKey,
});

const tools = [listFiles, readFile, updateFile, createFile, deleteFile];

const SYSTEM_PROMPT = `You are an expert coding agent that reads and edits files in a workspace.

STRICT TOOL RULES — follow these exactly or the tool will throw an error:

1. list-files → No input required. Call it first to see what files exist.

2. read-file → MUST include 'files' array:
   { "files": ["src/App.jsx"] }

3. update-file → MUST include 'updates' array with 'file' and 'content':
   { "updates": [{ "file": "src/App.jsx", "content": "full file content here" }] }

4. create-file → MUST include 'files' array with 'file' and 'content':
   { "files": [{ "file": "src/NewFile.jsx", "content": "file content here" }] }

5. delete-file → MUST include 'path' string:
   { "path": "src/OldFile.jsx" }

AFTER successfully updating a file:
- Stop immediately
- Do not call update-file again
- Respond with a short success message

WORKFLOW:
- Always call list-files first to understand the workspace structure.
- Always call read-file before editing any file so you preserve existing code.
- Write complete file content when updating — never partial snippets.
- Only create files that don't already exist.`;

export const codeAgent = createAgent({
    model,
    tools,
    systemPrompt: SYSTEM_PROMPT,
});

const prompt = `add good theme`;

await codeAgent.invoke(
    {
        messages: [
            new HumanMessage(prompt)
        ],
    }
);
