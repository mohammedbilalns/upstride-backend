import express from "express"
import cors from "cors"
import helmet from "helmet"
import { configDotenv } from "dotenv"
import cookieParser from "cookie-parser"
import { requestLogger } from "./interfaces/http/middlewares"
import { errorHandler } from "./interfaces/http/middlewares"
import logger from "./utils/logger"
import env from "./infra/config/env"
import proxyRoutes from "./interfaces/router/proxyRoutes"

configDotenv()
const app = express()
const PORT = env.PORT

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(requestLogger)

app.use("/v1", proxyRoutes)

app.get('/test', (_req, res) => {
  res.json({ message: "test from identity service" })
})

app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Identity service is running on port ${env.IDENTITY_SERVICE_URL}`)
  logger.info(`API Gateway started on port ${PORT}`)
})
























