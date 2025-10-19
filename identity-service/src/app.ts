import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import helmet from "helmet";
import { connectToDb, redisClient } from "./infrastructure/config";
import env from "./infrastructure/config/env";
import { connectRabbitMq } from "./infrastructure/events/connectRabbitMq";
import { errorHandler, requestLogger } from "./interfaces/http/middlewares";
import {
	createAuthRouter,
	createExpertiseRouter,
} from "./interfaces/http/routes";
import { createMentorRoutes } from "./interfaces/http/routes/mentor.routes";
import { createProfileRoutes } from "./interfaces/http/routes/profile.routes";
import { createUserManagementRouter } from "./interfaces/http/routes/userManagement.routes";

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

	/**
	 * Registers all application routes.
	 * - `/api/auth` → Authentication routes
	 * - `/api/users` → User management routes
	 * - `/api/expertise` → Expertise-related routes
	 * - `/api/mentor` → Mentor-related routes
	 * - Global error handler
	 *
	 * @private
	 */

	private _setupRoutes() {
		this._app.use("/api/auth", createAuthRouter());
		this._app.use("/api/users", createUserManagementRouter());
		this._app.use("/api/expertise", createExpertiseRouter());
		this._app.use("/api/mentor", createMentorRoutes());
		this._app.use("/api/profile", createProfileRoutes());
		this._app.use(errorHandler);
	}

	/**
	 * Starts the Express server and connects to required services.
	 *
	 * @param {string} port - The port number to listen on.
	 * @public
	 */
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
