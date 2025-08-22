import express from "express"
import cors from "cors"
import helmet from "helmet"
import { configDotenv } from "dotenv"
import cookieParser from "cookie-parser"
import logger from "./common/utils/logger"
import env from "./infrastructure/config/env"
import { connectRabbitMq } from "./infrastructure/events/connectRabbitMq"

configDotenv()
const app  = express()
const PORT = env.PORT

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.get('/test',(_req,res)=>{
  res.json({message:"test from mail service"})
})


connectRabbitMq()

app.listen(PORT, () => {
  logger.info(`Identity service started on port ${PORT}`)
})
























