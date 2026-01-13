import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import helmet from "helmet";
import logger from "./common/utils/logger";
import { connectToDb, redisClient } from "./infrastructure/config";
import env from "./infrastructure/config/env";
import { connectRabbitmq } from "./infrastructure/events/connect-rabbitmq";
import { errorHandler, requestLogger } from "./interfaces/http/middlewares";
import paymentRoutes from "./interfaces/http/routes/payment.routes";
/**
 * Main application class for the Identity Service.
 * Sets up middlewares, routes, and starts the Express server.
 */

class App {
	private _app: Application;

	/**
	 * Initializes a new instance of the App class.
	 * Configures Express with middlewares and routes.
	 */
	constructor() {
		this._app = express();
		this._setupMiddlewares();
		this._setupRoutes();
	}

	/**
	 * Configures and registers global middlewares for the application.
	 * - JSON parser
	 * - Helmet (security headers)
	 * - Cookie parser
	 * - Request logger
	 *
	 * @private
	 */

	private _setupMiddlewares() {
		this._app.use(helmet());
		this._app.use(
			cors({
				origin: [env.GATEWAY_URL, env.CLIENT_URL],
				credentials: true,
			}),
		);

		this._app.use(express.json());
		this._app.use(cookieParser());
		this._app.use(requestLogger);
	}

	/*
	 * Registers all application routes.
	 * - `/api/payments` → Payment related routes
	 * - Global error handler
	 *
	 * @private
	 */

	private _setupRoutes() {
		this._app.use("/api/payments", paymentRoutes);
		this._app.use(errorHandler);
	}

	/**
	 * Starts the Express server and connects to required services.
	 *
	 * @param {string} port - The port number to listen on.
	 * @public
	 */
	public listen(port: string) {
		const server = this._app.listen(port, () => {
			connectRabbitmq();
			connectToDb();
			redisClient.ping;
			logger.info(`Payment service started on port ${port}`);
		});
		return server;
	}
}

export default App;
