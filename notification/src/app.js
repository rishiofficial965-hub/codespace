import express from "express"
import morgan from "morgan"
import { sendEmail } from "./utils/sendEmail.js"
import { welcomeTemplate, otpTemplate, resetPasswordTemplate } from "./utils/emailTemplate.js"
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

// 1. Consume Registration Notifications (Welcome Emails)
channel.consume('auth_notification_queue', async (msg) => {
    if (msg !== null) {
        try {
            const message = JSON.parse(msg.content.toString());
            const { action, data } = message;

            if (action === 'register' && data && data.email) {
                const { email, fullname } = data;
                console.log(`📩 Processing registration notification for: ${email}`);

                const html = welcomeTemplate(fullname || "Developer");
                await sendEmail(
                    email, 
                    "Welcome to Capstone Sandbox! 🚀", 
                    "Welcome to Capstone Sandbox! Your cloud development workspace is ready.", 
                    html
                );
                console.log(`✅ Welcome email successfully sent to ${email}`);
            }
        } catch (error) {
            console.error("❌ Error processing registration notification:", error);
        } finally {
            channel.ack(msg);
        }
    }
});

// 2. Consume OTP Notifications (Verification & Reset Emails)
channel.consume('otp_queue', async (msg) => {
    if (msg !== null) {
        try {
            const message = JSON.parse(msg.content.toString());
            const { action, data } = message;

            if (data && data.email) {
                const { email, otp, username } = data;

                if (action === 'otp') {
                    console.log(`📩 Processing verification OTP notification for: ${email}`);
                    const html = otpTemplate(otp, username);
                    await sendEmail(
                        email, 
                        "Verify Your Email — Codespace", 
                        `Your OTP is ${otp}`, 
                        html
                    );
                    console.log(`✅ OTP email successfully sent to ${email}`);
                } else if (action === 'reset') {
                    console.log(`📩 Processing reset OTP notification for: ${email}`);
                    const html = resetPasswordTemplate(otp, username);
                    await sendEmail(
                        email, 
                        "Reset Your Password — Codespace", 
                        `Your reset OTP is ${otp}`, 
                        html
                    );
                    console.log(`✅ Password reset email successfully sent to ${email}`);
                }
            }
        } catch (error) {
            console.error("❌ Error processing OTP notification:", error);
        } finally {
            channel.ack(msg);
        }
    }
});

export default app;