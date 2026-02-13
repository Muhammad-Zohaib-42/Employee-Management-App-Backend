import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import taskRouter from "./routes/task.route.js"
import verifyJwt from "./middlewares/auth.middleware.js"

const app = express()

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res
    .status(statusCode)
    .json({
        success: false,
        message
    })
})

app.use("/api/auth", authRouter)
app.use("/api/tasks", verifyJwt, taskRouter)

export default app