import fs from "fs"
import path from "path"

const WORKDIR = "/workspace"

export const listFileController = async (req, res) => {
    try {
        const listFiles = async (dir, baseDir) => {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true })
            const files = []

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name)
                const relativePath = path.relative(baseDir, fullPath)
                if (entry.isDirectory() && !['node_modules', '.git', 'dist'].includes(entry.name)) {
                    files.push(...await listFiles(fullPath, baseDir))
                }
                else {
                    files.push(relativePath)
                }
            }
            return files
        }
        const files = await listFiles(WORKDIR, WORKDIR)
        return res.status(200).json({
            message: "Files fetched successfully",
            success: true,
            files
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch files",
            error: error.message
        })
    }
}

export const readFileController = async (req, res) => {
    try {
        const { files } = req.query
        if (!files) {
            return res.status(400).json({
                message: "Path is required",
                success: false,
            })
        }
        const fileList = files.split(",")
        const result = await Promise.all(
            fileList.map(async (file) => {

                const filePath = path.resolve(WORKDIR, file)

                if (!filePath.startsWith(WORKDIR)) {
                    throw new Error("Invalid file path")
                }

                const content =
                    await fs.promises.readFile(
                        filePath,
                        "utf-8"
                    )

                return {
                    [filePath.replace(WORKDIR, '')]: content
                }
            })
        )
        return res.status(200).json({
            message: "Files fetched successfully",
            success: true,
            files: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch files",
            error: error.message
        })
    }
}


export const updateFileController = async (req, res) => {
    try {
        const { updates } = req.body
        if (!updates || !Array.isArray(updates)) {
            return res.status(400).json({
                message: "Updates is required",
                success: false,
            })
        }
        const result = await Promise.all(
            updates.map(async ({ file, content }) => {
                if (!file || content === undefined) {
                    throw new Error("File and content required")
                }
                const filePath = path.resolve(WORKDIR, file)
                if (!filePath.startsWith(WORKDIR)) {
                    throw new Error("Invalid file path")
                }
                await fs.promises.writeFile(
                    filePath,
                    content,
                    "utf-8"
                )
                return {
                    [filePath.replace(WORKDIR, "")]: content
                }
            })
        )
        return res.status(200).json({
            message: "Files updated successfully",
            success: true,
            files: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update files",
            error: error.message
        })
    }
}

export const createFileController = async (req, res) => {
    try {
        const { files } = req.body
        if (!files || !Array.isArray(files)) {
            return res.status(400).json({
                message: "Files is required",
                success: false,
            })
        }

        const result = await Promise.all(files.map(async (fileObj) => {
            const { file, content } = fileObj
            if (!file || content === undefined) {
                throw new Error("File and content required")
            }
            const filePath = path.resolve(WORKDIR, file)
            if (!filePath.startsWith(WORKDIR)) {
                throw new Error("Invalid file path")
            }
            await fs.promises.mkdir(
                path.dirname(filePath),
                { recursive: true }
            )
            await fs.promises.writeFile(
                filePath,
                content,
                "utf-8"
            )
            return {
                [filePath.replace(WORKDIR, '')]: content
            }
        }))
        return res.status(200).json({
            message: "Files created successfully",
            success: true,
            files: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create files",
            error: error.message
        })
    }
}

export const deleteController = async (req, res) => {
    try {

        const { path: targetPath } = req.body

        if (!targetPath) {
            return res.status(400).json({
                success: false,
                message: "Path is required"
            })
        }

        const fullPath = path.resolve(
            WORKDIR,
            targetPath
        )

        if (!fullPath.startsWith(WORKDIR)) {
            return res.status(400).json({
                success: false,
                message: "Invalid path"
            })
        }

        await fs.promises.rm(
            fullPath,
            {
                recursive: true,
                force: false
            }
        )

        return res.status(200).json({
            success: true,
            message: "Deleted successfully",
            path: targetPath
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to delete",
            error: error.message
        })

    }
}