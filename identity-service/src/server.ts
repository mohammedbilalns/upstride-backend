import express from "express"
import cors from "cors"
import helmet from "helmet"
import { configDotenv } from "dotenv"
import cookieParser from "cookie-parser"
import { requestLogger } from "./interfaces/http/middlewares"
import { errorHandler } from "./interfaces/http/middlewares"
import { connectToDb } from "./infrastructure/config/connectDb"
import logger from "./common/utils/logger"
import env from "./infrastructure/config/env"
import authRoutes from "./interfaces/http/routes/auth.routes"
configDotenv()
const app  = express()
const PORT = env.PORT

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(requestLogger)

app.use("/api/auth", authRoutes)

app.use(errorHandler)

connectToDb()

app.listen(PORT, () => {
  logger.info(`Identity service started on port ${PORT}`)
})
























