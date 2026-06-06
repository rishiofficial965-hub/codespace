import express from "express"
import morgan from "morgan"
import { sendEmail } from "./utils/sendEmail.js"
import { welcomeTemplate } from "./utils/emailTemplate.js"
import channel from "./config/mq.js"
const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))

app.get("/api/healthz", (req, res) => {
    res.send("OK")
})
app.get("/api/readyz", (req, res) => {
    res.send("OK")
})

channel.consume('auth_notification_queue', async (msg) => {
    if (msg !== null) {
        try {
            const message = JSON.parse(msg.content.toString());
            const { userId, action, timestamp, data } = message;
            
            if (action === 'register' && data && data.email) {
                const { email, fullname } = data;
                console.log(`📩 Processing registration notification for: ${email}`);
                
                const html = welcomeTemplate(fullname || "Developer");
                await sendEmail(email, "Welcome to Capstone Sandbox! 🚀", "Welcome to Capstone Sandbox! Your cloud development workspace is ready.", html);
                console.log(`✅ Welcome email successfully sent to ${email}`);
            }   
        } catch (error) {
            console.error("❌ Error processing notification queue message:", error);
        } finally {
            channel.ack(msg);
        }
    }
})

export default app