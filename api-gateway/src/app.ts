import { createServer } from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import env from "./infra/config/env";
import { errorHandler } from "./interfaces/http/middlewares";
import proxyRoutes from "./interfaces/http/router/proxyRoutes";
import logger from "./utils/logger";

/**
 * Main application class for the API Gateway.
 *
 * Responsibilities:
 * - Initialize Express application
 * - Configure global middlewares
 * - Register proxy routes
 * - Create and expose the underlying HTTP server
 */
class App {
	private _app: Application;
	private _server: ReturnType<typeof createServer>;

	/**
	 * Creates a new instance of the App class.
	 * Sets up Express, attaches middlewares, and registers routes.
	 */
	constructor() {
		this._app = express();
		this._server = createServer(this._app);
		this._setupMiddlewares();
		this._setupRoutes();
	}

	/**
	 * Registers all global middlewares for the API Gateway.
	 * Includes:
	 * - Helmet for security headers
	 * - CORS configuration
	 * - JSON body parsing
	 * - Cookie parsing
	 *
	 * @private
	 */
	private _setupMiddlewares() {
		this._app.use(helmet());

		this._app.use(
			cors({
				origin: env.CLIENT_URL,
				credentials: true,
			}),
		);

		this._app.use(express.json());
		this._app.use(cookieParser());
	}

	/**
	 * Registers all API Gateway routes.
	 * - `/v1` → Main reverse proxy to backend services
	 * - Global error handler
	 *
	 * @private
	 */
	private _setupRoutes() {
		this._app.use("/v1", proxyRoutes);
		this._app.use(errorHandler);
	}

	/**
	 * Provides access to the underlying HTTP server instance.
	 *
	 */
	public get server() {
		return this._server;
	}

	/**
	 * Starts the HTTP server on the specified port.
	 *
	 * @param {string} port - The port to listen on.
	 */
	public listen(port: string) {
		this._server.listen(port, () => {
			logger.info(`API Gateway started on port ${port}`);
		});
	}
}

export default App;
