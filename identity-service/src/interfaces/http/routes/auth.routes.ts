import { Router } from "express"
import { createAuthController } from "../compositions/auth.composition"
const router = Router()

const authController = createAuthController()

router.get('/test', (_req, res) => {
  res.json({ message: "test from identity service" })
})
router.post('/login', authController.login)



export default router