import app, { handleUpgrade } from "./src/app.js"

const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`Sandbox router running on port ${PORT}`)
})

server.on('upgrade', (req, socket, head) => {
    handleUpgrade(req, socket, head)
})
