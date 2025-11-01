import { Application } from "express";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler, requestLogger } from "./interfaces/http/middlewares";
import logger from "./common/utils/logger";
import { connectToDb } from "./infrastructure/config/connectDb";

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
		this._app.use(errorHandler);
	}

	public listen(port: string) {
		this._app.listen(port, () => {
			connectToDb();
			logger.info(`Sesssions service is listening on port ${port}`);
		});
	}
}

export default App;
