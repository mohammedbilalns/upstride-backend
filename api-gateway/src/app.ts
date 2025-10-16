import express from "express"
import { Application } from "express"
import cors from "cors" 
import helmet from "helmet" 
import cookieParser from "cookie-parser"
import env  from "./infra/config/env"
import proxyRoutes from "./interfaces/router/proxyRoutes"
import logger from "./utils/logger"
import { errorHandler } from "./interfaces/http/middlewares"

class App {
	private _app:Application
	constructor(){
		this._app = express()
		this._setupMiddlewares() 
		this._setupRoutes()
	}


	private _setupMiddlewares(){
		this._app.use(helmet())
		this._app.use(cors({
			origin:env.CLIENT_URL,
			credentials:true
		}))
		this._app.use(express.json())
		this._app.use(cookieParser())
	}

	private _setupRoutes(){
		this._app.use("/v1", proxyRoutes)
		this._app.use(errorHandler)
	}


	public listen(port: string){
		this._app.listen(port, () => {
			logger.info(`API Gateway started on port ${port}`)
		})

	}
}

export default App 
