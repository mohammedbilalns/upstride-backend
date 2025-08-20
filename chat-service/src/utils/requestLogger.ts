import logger from "./logger"
import { Request, Response, NextFunction } from "express"

export const requestLogger = (req: Request, re: Response, next: NextFunction) => {
  logger.info(`Recieved ${req.method} request to ${req.url}`)
  logger.info(`Request body, ${req.body}`)
  next()
}



