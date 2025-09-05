import { Application } from "express";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { requestLogger, errorHandler } from "./interfaces/http/middlewares";
import {
  createAuthRouter,
  createExpertiseRouter,
} from "./interfaces/http/routes";
import { connectToDb, redisClient } from "./infrastructure/config";
import { connectRabbitMq } from "./infrastructure/events/connectRabbitMq";
import { createUserManagementRouter } from "./interfaces/http/routes/userManagement.routes";
import { createMentorRoutes } from "./interfaces/http/routes/mentor.routes";
class App {
  private _app: Application;
  constructor() {
    this._app = express();
    this._setupMiddlewares();
    this._setupRoutes();
  }

  private _setupMiddlewares() {
    this._app.use(express.json());
    this._app.use(helmet());
    this._app.use(cookieParser());
    this._app.use(requestLogger);
  }

  private _setupRoutes() {
    this._app.use("/api/auth", createAuthRouter());
    this._app.use("/api/users", createUserManagementRouter());
    this._app.use("/api/expertise", createExpertiseRouter());
    this._app.use("/api/mentor", createMentorRoutes());
    this._app.use(errorHandler);
  }

  public listen(port: string) {
    this._app.listen(port, () => {
      connectRabbitMq();
      connectToDb();
      redisClient.ping;
      console.log(`Identity service started on port ${port}`);
    });
  }
}

export default App;
