import dotenv from "dotenv"

dotenv.config()

export const Config = {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackURL: process.env.GOOGLE_CALLBACK_URL,
    mongoURI: process.env.AUTH_MONGO_URI,
    jwtSecret:process.env.JWT_SECRET,
    brevoApiKey:process.env.BREVO_API_KEY,
    brevoSenderEmail:process.env.BREVO_SENDER_EMAIL
}