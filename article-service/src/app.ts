import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import helmet from "helmet";
import logger from "./common/utils/logger";
import { connectToDb } from "./infrastructure/config/connectDb";
import {
  createArticleRoutes,
  createCommentRoutes,
  createReactionRoutes,
} from "./interfaces/http/routes";
import { errorHandler, requestLogger } from "./interfaces/http/middlewares";
import { createTagRoutes } from "./interfaces/http/routes/tag.routes";

class App {
	private _app: Application;
	constructor() {
		this._app = express();
		this._setupMiddleware();
		this._setupRoutes();
	}

	private _setupMiddleware() {
		this._app.use(express.json());
		this._app.use(helmet());
		this._app.use(cookieParser());
		this._app.use(requestLogger);
	}

  private _setupRoutes() {
    this._app.use("/api/articles", createArticleRoutes());
    this._app.use("/api/comments", createCommentRoutes());
    this._app.use("/api/reactions", createReactionRoutes());
		this._app.use("/api/tags", createTagRoutes());
    this._app.use(errorHandler);
  }

	public listen(port: string) {
		this._app.listen(port, () => {
			connectToDb();
			logger.info(`Article service is listening on port ${port}`);
		});
	}
}

export default App;
