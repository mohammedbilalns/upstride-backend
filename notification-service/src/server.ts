import express from "express"
import cors from "cors"
import helmet from "helmet"
import { configDotenv } from "dotenv"
import cookieParser from "cookie-parser"
import { requestLogger } from "./interfaces/http/middlewares"
import { errorHandler } from "./interfaces/http/middlewares"
import { connectToDb } from "./infra/config/db"
import logger from "./utils/logger"
import env from "./infra/config/env"

configDotenv()
const app  = express()
const PORT = env.PORT

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(requestLogger)


app.get('/test',(_req,res)=>{
  res.json({message:"test from notification service"})
})


app.use(errorHandler)

connectToDb()

app.listen(PORT, () => {
  logger.info(`notification service started on port ${PORT}`)
})
























