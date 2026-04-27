import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { DashboardController } from "../controllers/dashboard.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import { DashboardActivityOverviewQuerySchema } from "../validators/dashboard.validator";

const router = Router();
const controller = apiContainer.get<DashboardController>(
	TYPES.Controllers.Dashboard,
);

router.use(verifySession, authorizeRoles(["USER", "MENTOR"]));

router.get(ROUTES.DASHBOARD.ROOT, controller.getDashboard);

router.get(
	ROUTES.DASHBOARD.ACTIVITY_OVERVIEW,
	validate({ query: DashboardActivityOverviewQuerySchema }),
	controller.getActivityOverview,
);

export { router as dashboardRouter };
