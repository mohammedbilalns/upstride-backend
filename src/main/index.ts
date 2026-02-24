import env from "@/infrastructure/config/env.js";
import App from "./app.js";


let isShuttingDown = false
let appInstance: App

async function bootStrap(){

  appInstance = new App()
  appInstance.listen(env.PORT)
}
async function shutdown(signal: string){
  if(isShuttingDown) return

  isShuttingDown = true
  console.log(`Received ${signal}, shutting down...`)

  const forceExitTimeout = setTimeout(() => {
    console.log(`Force exiting...`)
    process.exit(1)
  }, 10000) 

  try {
    if(appInstance) await appInstance.close()

    //TODO: add all clean up tasks
    await Promise.all([])
    clearTimeout(forceExitTimeout)
  } catch (error) {
    clearTimeout(forceExitTimeout)
    console.error(`Error shutting down: ${error}`)
    process.exit(1)
  }
}

  
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((signal) => {
  process.on(signal, shutdown)
})

process.on("uncaughtException", (error: Error) => {
  console.log(`Uncaught Exception: ${error}`)
  shutdown("uncaughtException")
})

process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
  console.error(`Unhandled Rejection at: ${promise} reason: ${reason}`)
  shutdown("unhandledRejection")
})

bootStrap()
