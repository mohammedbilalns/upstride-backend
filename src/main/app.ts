import * as nodeHttp from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import { corsOptions } from "../interfaces/http/config/cors.config";
import { requestLogger } from "../interfaces/http/middlewares/request-logger.middleware";
import logger from "../shared/logging/logger";

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
	private _server: ReturnType<typeof nodeHttp.createServer>;

	constructor() {
		this._app = express();
		this._server = nodeHttp.createServer(this._app);
		this._setupMiddlewares();
		this._setupRoutes();
	}

	/**
	 * Register global middlewares.
	 *
	 * - JSON parsing
	 * - CORS
	 * - Security
	 * - Logging
	 * - Rate limiting
	 */
	private _setupMiddlewares() {
		this._app
			.use(helmet())
			.use(requestLogger)
			.use(cors(corsOptions))
			.use(express.json())
			.use(cookieParser());
	}
	private _setupRoutes() {
		this._app.use("/api/test", async (_req, res) => {
			res.send("Hello World");
		});
	}

	public get server() {
		return this._server;
	}

	public listen(port: number) {
		this._server.listen(port, () => {
			logger.info(`server started on port: ${port}`);
		});
	}

	public async close() {
		return new Promise((resolve, reject) => {
			this._server.close((err) => {
				if (err) reject(err);
				resolve(null);
			});
		});
	}
}

export default App;
