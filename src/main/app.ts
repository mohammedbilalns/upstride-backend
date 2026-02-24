import logger from "@/infrastructure/logging/logger.js";
import express, { Application } from "express";
import {createServer} from "node:http";

class App {
  private _app : Application
  private _server: ReturnType<typeof createServer >

  constructor(){
    this._app = express()
    this._server = createServer(this._app)
    this._setupMiddlewares()
    this._setupRoutes()
  }

  private _setupMiddlewares(){}
  private _setupRoutes(){
    this._app.use("/api/test", async (_req, res) => {
      res.send("Hello World")
    })
  }

  public get server(){
    return this._server
  }

  public listen(port: number){
    this._server.listen(port, () =>{
      logger.info(`server started on port: ${port}`)
    })
  }

  public async close(){
    return new Promise((resolve, reject) => {
    this._server.close((err) => {
        if(err) reject(err)
        resolve(null)
      })
    })
  }
}

export default App
