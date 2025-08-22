import express from "express";
import cors from "cors";
import helmet from "helmet";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import { requestLogger, errorHandler } from "./interfaces/http/middlewares";
import { connectToDb } from "./infrastructure/config/connectDb";
import logger from "./common/utils/logger";
import env from "./infrastructure/config/env";
import createAuthRouter from "./interfaces/http/routes/auth.routes";
import { connectRabbitMq } from "./infrastructure/events/connectRabbitMq";
import { connectRedis } from "./infrastructure/config/connectRedis";

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
  await connectRedis(); 

  app.use("/api/auth", createAuthRouter());
  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`Identity service started on port ${PORT}`);
  });
}

startServer();

