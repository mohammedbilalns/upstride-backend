import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import helmet from "helmet";
import { initializeJobs } from "./application/jobs";
import logger from "./common/utils/logger";
import { connectToDb } from "./infrastructure/config/connect-db";
import { connectRabbitmq } from "./infrastructure/events/connect-rabbitmq";
import { errorHandler, requestLogger } from "./interfaces/http/middlewares";
import { createNotificationRouter } from "./interfaces/http/routes/notification.routes";

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
		this._app.use("/api/notifications", createNotificationRouter());
		this._app.use(errorHandler);
	}

	public listen(port: string) {
		const server = this._app.listen(port, () => {
			connectRabbitmq();
			connectToDb();
			initializeJobs();
			logger.info(`Notification service is listening on port ${port}`);
		});
		return server;
	}
}

export default App;
