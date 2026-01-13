import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import logger from "./common/utils/logger";
import { connectToDb } from "./infrastructure/config/connect-db";
import env from "./infrastructure/config/env";
import { connectRabbitmq } from "./infrastructure/events/connect-rabbitmq";
import { errorHandler, requestLogger } from "./interfaces/http/middlewares";
import { createChatRoutes } from "./interfaces/http/routes/chat.routes";

class App {
	private _app: Application;
	constructor() {
		this._app = express();
		this._setupMiddlewares();
		this._setupRoutes();
	}

	private _setupMiddlewares() {
		this._app.use(helmet());
		this._app.use(
			cors({
				origin: [env.CLIENT_URL, env.GATEWAY_URL],
				credentials: true,
			}),
		);

		this._app.use(express.json());
		this._app.use(cookieParser());
		this._app.use(requestLogger);
	}

	private _setupRoutes() {
		this._app.use("/api/chat", createChatRoutes());
		this._app.use(errorHandler);
	}

	public listen(port: string) {
		const server = this._app.listen(port, async () => {
			await connectRabbitmq();
			await connectToDb();
			logger.info(`Chat service is listening on port ${port}`);
		});
		return server;
	}
}

export default App;
