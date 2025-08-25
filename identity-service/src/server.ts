import express from "express";
import cors from "cors";
import helmet from "helmet";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import { requestLogger, errorHandler } from "./interfaces/http/middlewares";
import logger from "./common/utils/logger";
import { connectToDb, redisClient } from "./infrastructure/config";
import {
  createAuthRouter,
  createExpertiseRouter,
} from "./interfaces/http/routes";
import { connectRabbitMq } from "./infrastructure/events/connectRabbitMq";
import env from "./infrastructure/config/env";

configDotenv();
const app = express();
const PORT = env.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

async function startServer() {
  await connectRabbitMq();
  await connectToDb();
  await redisClient.ping()
  
  app.use("/api/auth", createAuthRouter());
  app.use("/api/expertise", createExpertiseRouter());
  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`Identity service started on port ${PORT}`);
  });
}

startServer();
