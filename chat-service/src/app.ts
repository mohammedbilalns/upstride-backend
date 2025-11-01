import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import logger from "./common/utils/logger";
import { connectToDb } from "./infrastructure/config/connectDb";
import env from "./infrastructure/config/env";
import { connectRabbitMq } from "./infrastructure/events/connectRabbitMq";
import { errorHandler, requestLogger } from "./interfaces/http/middlewares";


class App {
  private _app: Application;
  constructor() {
    this._app = express();
    this._setupMiddlewares()
    this._setupRoutes()
  }

  private _setupMiddlewares() {
    this._app.use(helmet());
    this._app.use(cors({
      origin : [env.CLIENT_URL, env.GATEWAY_URL],
      credentials: true
    }));

    this._app.use(express.json());
    this._app.use(cookieParser());
    this._app.use(requestLogger);
  }

  private _setupRoutes() {

    this._app.use(errorHandler);
  }

  public listen(port: string) {
    this._app.listen(port, () => {
      connectRabbitMq()
      connectToDb();
      logger.info(`Chat service is listening on port ${port}`)
    } )
  }
}

export default App;
