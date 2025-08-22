import { Router } from "express"
import { createAuthController } from "../compositions/auth.composition"
import { rateLimiter } from "../middlewares/rateLimiter.middleware"

export default function createAuthRouter() {
  const router = Router()
  const authController = createAuthController()

  router.get('/test', (_req, res) => {
    res.json({ message: "test from identity service" })
  })
  router.post('/login', authController.login)

  router.post('/register', rateLimiter(5,60,["ip","route"]), authController.register)

  return router
}