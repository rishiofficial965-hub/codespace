import express from "express"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js"
import passport from "passport"
import cookies from "cookie-parser"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Config } from "./config/dotenv.js"

const app = express()

//middlewares
app.use(express.json())
app.use(morgan("dev"))
app.use(cookies())
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID: Config.googleClientId,
    clientSecret: Config.googleClientSecret,
    callbackURL: Config.googleCallbackURL,
    scope: ["profile", "email"]
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile)
}))
app.use("/api/auth", authRouter)

app.get("/api/healthz", (req, res) => {
    res.send("ok")
})

app.get("/api/readyz", (req, res) => {
    res.send("ok")
})


export default app;