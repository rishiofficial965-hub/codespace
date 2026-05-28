import axios from "axios";
import { tool } from "langchain";
import { z } from "zod";

const BASE_URL = "http://sandbox-service-019e6e23-f9d1-73a6-98c1-741a27babc65:3000";

// LIST FILES
export const listFiles = tool(
    async () => {
        console.log("\n🔧 [TOOL] list-files called");
        console.log(`   → GET ${BASE_URL}/list-files`);

        const response = await axios.get(
            `${BASE_URL}/list-files`
        );

        const files = response.data.files;
        console.log(`   ✅ Got ${files.length} files:`, files);

        return JSON.stringify(files);
    },
    {
        name: "list-files",
        description: "Lists every file path in the workspace. Call this first before reading or editing anything so you know what files exist. Takes no input arguments.",
        schema: z.object({})
    }
);

// READ FILE
export const readFile = tool(
    async ({ files }) => {
        console.log("\n🔧 [TOOL] read-file called");

        if (!files || !Array.isArray(files) || files.length === 0) {
            console.error("   ❌ ERROR: 'files' argument is missing or empty!");
            throw new Error("read-file requires a 'files' array, e.g. { files: ['src/App.jsx'] }");
        }

        console.log(`   → Reading files:`, files);
        console.log(`   → GET ${BASE_URL}/read-files?files=${files.join(",")}`);

        const response = await axios.get(
            `${BASE_URL}/read-files`,
            {
                params: {
                    files: files.join(",")
                }
            }
        );

        const result = response.data.files;
        console.log(`   ✅ Read ${result.length} file(s) successfully`);
        result.forEach(entry => {
            const [filePath, content] = Object.entries(entry)[0];
            console.log(`   📄 ${filePath} (${content.length} chars)`);
        });

        return JSON.stringify(result);
    },
    {
        name: "read-file",
        description: `Read the contents of one or more files from the workspace. REQUIRED: you MUST pass a 'files' array with at least one file path. Example input: { "files": ["src/App.jsx"] }. Never call this tool without the files argument.`,

        schema: z.object({
            files: z
                .array(z.string())
                .min(1)
                .describe("Array of file paths to read, e.g. ['src/App.jsx', 'src/index.css']")
        })
    }
);

// UPDATE FILE
export const updateFile = tool(
    async ({ updates }) => {
        console.log("\n🔧 [TOOL] update-file called");
        console.log(`   → Updating ${updates.length} file(s):`);
        updates.forEach(u => {
            console.log(`   ✏️  ${u.file} (${u.content.length} chars)`);
        });
        console.log(`   → PATCH ${BASE_URL}/update-files`);

        const response = await axios.patch(
            `${BASE_URL}/update-files`,
            {
                updates
            }
        );

        console.log(`   ✅ Update successful`);

        return JSON.stringify(response.data.files);
    },
    {
        name: "update-file",
        description: `Overwrite the full content of one or more existing files. REQUIRED: pass an 'updates' array where each item has a 'file' (path string) and 'content' (the complete new file content as a string). Example: { "updates": [{ "file": "src/App.jsx", "content": "function App()..." }] }. Always read the file first before updating so you preserve existing structure.`,

        schema: z.object({
            updates: z
                .array(
                    z.object({
                        file: z
                            .string()
                            .describe("Relative file path, e.g. 'src/App.jsx'"),

                        content: z
                            .string()
                            .describe("The complete new content to write to the file")
                    })
                )
                .min(1)
                .describe("Array of file updates to apply")
        })
    }
);

// CREATE FILE
export const createFile = tool(
    async ({ files }) => {
        console.log("\n🔧 [TOOL] create-file called");
        console.log(`   → Creating ${files.length} file(s):`);
        files.forEach(f => {
            console.log(`   📝 ${f.file} (${f.content.length} chars)`);
        });
        console.log(`   → POST ${BASE_URL}/create-file`);

        const response = await axios.post(
            `${BASE_URL}/create-files`,
            {
                files
            }
        );

        console.log(`   ✅ Files created successfully`);

        return JSON.stringify(response.data.files);
    },
    {
        name: "create-file",
        description: `Create one or more new files in the workspace. REQUIRED: pass a 'files' array where each item has a 'file' (path string) and 'content' (file content string). Example: { "files": [{ "file": "src/NewComponent.jsx", "content": "export default function..." }] }. Only use this for files that do not already exist — use update-file for existing files.`,

        schema: z.object({
            files: z
                .array(
                    z.object({
                        file: z
                            .string()
                            .describe("Relative file path to create, e.g. 'src/Button.jsx'"),

                        content: z
                            .string()
                            .describe("Full content to write into the new file")
                    })
                )
                .min(1)
                .describe("Array of files to create")
        })
    }
);

// DELETE FILE
export const deleteFile = tool(
    async ({ path }) => {
        console.log("\n🔧 [TOOL] delete-file called");
        console.log(`   → Deleting path: ${path}`);
        console.log(`   → DELETE ${BASE_URL}/delete-path`);

        const response = await axios.delete(
            `${BASE_URL}/delete-path`,
            {
                data: {
                    path
                }
            }
        );

        console.log(`   ✅ Deleted successfully: ${path}`);

        return JSON.stringify(response.data);
    },
    {
        name: "delete-file",
        description: `Permanently delete a file or folder from the workspace. REQUIRED: pass a 'path' string with the relative path to delete. Example: { "path": "src/OldComponent.jsx" }. Use with caution — this cannot be undone. Never delete critical files like package.json or index.html.`,

        schema: z.object({
            path: z
                .string()
                .describe("Relative path of the file or folder to delete, e.g. 'src/OldFile.jsx'")
        })
    }
);