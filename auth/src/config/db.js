import mongoose from "mongoose"
import { Config } from "./dotenv.js"
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export default async function connectToDb() {
    try {
        await mongoose.connect(Config.mongoURI)
        console.log("MongoDB connected")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    }
}