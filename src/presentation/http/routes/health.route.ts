import { Router } from "express";
import { ROUTES } from "../constants";
import { healthCheckHandler } from "../controllers/health.controller";

const router = Router();

router.get(ROUTES.HEALTH_CHECK, healthCheckHandler);

export { router as healthRouter };
