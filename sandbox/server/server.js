import app from "./src/app.js"
import { connectMongo } from "./src/config/mongo.js"

const PORT = process.env.PORT || 3000
connectMongo()
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
