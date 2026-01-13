import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import helmet from "helmet";
import logger from "./common/utils/logger";
import { connectToDb } from "./infrastructure/config/connect-db";
import { connectRabbitmq } from "./infrastructure/events/connect-rabbitmq";
import { errorHandler, requestLogger } from "./interfaces/http/middlewares";
import { notFound } from "./interfaces/http/middlewares/notFound.middleware";
import { createMediaRoutes } from "./interfaces/http/routes/media.routes";

class App {
	private _app: Application;
	constructor() {
		this._app = express();
		this._setupMiddleware();
		this._setupRoutes();
	}

	private _setupMiddleware() {
		this._app.use(helmet());
		this._app.use(cookieParser());
		this._app.use(express.json());
		this._app.use(express.urlencoded({ extended: true }));
		this._app.use(requestLogger);
	}

	private _setupRoutes() {
		this._app.get("/health", (_req, res) => {
			res.send("OK");
		});
		this._app.use("/api/media", createMediaRoutes());
		this._app.use(errorHandler);
		this._app.use(notFound);
	}

	public listen(port: string) {
		const server = this._app.listen(port, () => {
			connectRabbitmq();
			connectToDb();
			logger.info(`Media service is listening on port ${port}`);
		});
		return server;
	}
}

export default App;
