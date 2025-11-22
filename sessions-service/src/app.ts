import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import helmet from "helmet";
import logger from "./common/utils/logger";
import { connectToDb } from "./infrastructure/config/connectDb";
import { connectRabbitMq } from "./infrastructure/events/connectRabbitMq";
import { errorHandler, requestLogger } from "./interfaces/http/middlewares";

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
		const server = this._app.listen(port, () => {
			connectToDb();
			connectRabbitMq();
			logger.info(`Sesssions service is listening on port ${port}`);
		});
		return server;
	}
}

export default App;
