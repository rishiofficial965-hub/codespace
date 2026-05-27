import app from "./src/app.js"
import { Config } from "./src/config/config.js"


app.listen(Config.port, () => {
    console.log(`AI Orchestrator is running on port ${Config.port}`)
})