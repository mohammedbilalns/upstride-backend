import { Db, MongoClient } from "mongodb";
import env from "@infrastructure/config/env.js";
import logger from "../logging/logger.js";


let client : MongoClient | null = null 
let db : Db | null = null 

export const connectToMongo = async (): Promise<Db> =>{
  if(db) return db 

  try{
    client = new MongoClient(env.MONGODB_URI)
    await client.connect()

    db = client.db()
    logger.info(`Connected to MongoDB`)

    return db
  }catch(e){
    logger.error(`Error connecting to database: ${e}`)
    process.exit(1)
  }
}

export const getDb = (): Db =>{
  if(!db) throw new Error("Database not connected")
  return db
}

export const disconnectFromMongo = async (): Promise<void> =>{
  if(!client) return

  try {

    await client.close()
    client = null 
    db = null 

    logger.info(`Disconnected from database`)
    
  } catch (error) {
    logger.error(`Error disconnecting from database: ${error}`)
    
  }
}
