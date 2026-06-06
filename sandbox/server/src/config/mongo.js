import mongoose from "mongoose";
import { Config } from "./dotenv.js";

export const connectMongo = () => {
    try {
        mongoose.connect(Config.authMongoUri);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
