import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import env from "./infra/config/env";
import { errorHandler } from "./interfaces/http/middlewares";
import proxyRoutes from "./interfaces/http/router/proxyRoutes";
import logger from "./utils/logger";
import { createServer } from "http";

class App {
	private _app: Application;
	private _server: ReturnType<typeof createServer >
	constructor() {
		this._app = express();
		this._server = createServer(this._app)
		this._setupMiddlewares();
		this._setupRoutes();
	}

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

	private _setupRoutes() {
		this._app.use("/v1", proxyRoutes);
		this._app.use(errorHandler);
	}

	public get server(){
		return this._server
	}

	public listen(port: string) {
		this._server.listen(port, () => {
			logger.info(`API Gateway started on port ${port}`);
		});
	}

}

export default App;
