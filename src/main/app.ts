import { createServer } from "node:http";
import compression from "compression";
//import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import { corsOptions } from "../presentation/http/config";
import { errorHandler, requestLogger } from "../presentation/http/middlewares";
import { router as v1Router } from "../presentation/http/routes";
import { healthRouter } from "../presentation/http/routes/health.route";
import { stripeWebhookRouter } from "../presentation/http/routes/stripe-webhook.route";
import type { WebSocketServer } from "../presentation/websocket/socket-server";
import { HttpStatus } from "../shared/constants";
import logger from "../shared/logging/logger";
import { TYPES } from "../shared/types/types";
import { apiContainer } from "./di/api.container";

/**
 * Core application bootstrapper.
 *
 * - Initialize Express instance
 * - Attach middlewares and routes
 * - Wrap Express in a native HTTP server
 *
 */
class App {
	private _app: Application;
	private _server: ReturnType<typeof createServer>;
	private _wsServer: WebSocketServer | null = null;

	constructor() {
		this._app = express();
		this._server = createServer(this._app);
		this._setupWebhookRoutes();
		this._setupMiddlewares();
		this._setupRoutes();
		this._setupWebSocket();
		this._setupErrorHandlers();
	}

	private _setupWebSocket() {
		this._wsServer = apiContainer.get<WebSocketServer>(
			TYPES.Services.WebSocketServer,
		);
		if (this._wsServer) {
			this._wsServer.initialize(this._server);
		}
	}

	/**
	 * Register global middlewares.
	 */
	private _setupMiddlewares() {
		this._app
			.use(helmet())
			.use(compression())
			.use(requestLogger)
			.use(cors(corsOptions))
			.use(express.json())
			.use(express.urlencoded({ extended: true }))
			.use(cookieParser());
	}
	private _setupWebhookRoutes() {
		this._app.use("/api/webhooks/stripe", stripeWebhookRouter);
	}
	private _setupRoutes() {
		this._app.use(healthRouter);
		this._app.use("/api/v1", v1Router);

		this._app.use((req, res) => {
			res.status(HttpStatus.NOT_FOUND).json({
				success: false,
				message: `Route ${req.method} ${req.originalUrl} not found`,
			});
		});
	}

	private _setupErrorHandlers() {
		this._app.use(errorHandler);
	}

	public get server() {
		return this._server;
	}

	public listen(port: number) {
		this._server.listen(port, () => {
			logger.info(`server started on port: ${port}`);
		});
	}

	public async close(): Promise<void> {
		if (this._wsServer) await this._wsServer.close();
		return new Promise<void>((resolve, reject) => {
			this._server.close((err) => {
				if (err) reject(err);
				resolve();
			});
		});
	}
}

export default App;
