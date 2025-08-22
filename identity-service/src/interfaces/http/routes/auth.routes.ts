import { Router } from "express"
import { createAuthController } from "../compositions/auth.composition"
import { rateLimiter } from "../middlewares/rateLimiter.middleware"

export  function createAuthRouter() {
	const router = Router()
	const authController = createAuthController()

	router.post('/login', authController.login)
	router.post('/register', rateLimiter(5,60,["ip","route"]), authController.register)	
	router.post('/google-authuth', authController.googleAuth)
	router.post('/verify-otp', rateLimiter(5,60,["ip","route"]), authController.verifyOtp)
	router.post('/reset-password', rateLimiter(5,60,["ip","route"]), authController.reset)
	router.post('/verify-reset-otp', rateLimiter(5,60,["ip","route"]), authController.verifyResetOtp)
	router.post('/update-password', rateLimiter(5,60,["ip","route"]), authController.updatePassword)
	router.post('/logout', authController.logout)
	return router
}
