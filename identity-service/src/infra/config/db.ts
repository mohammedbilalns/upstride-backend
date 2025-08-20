import mongoose from "mongoose"
import logger from "../../utils/logger"
import env from "./env"

export const connectToDb = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI)
    logger.info(`Connected to database`)
  } catch (err) {
    logger.error(`Error connecting to database, ${err}`)
    process.exit(1)
  }
}