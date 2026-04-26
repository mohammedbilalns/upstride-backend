import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { AdminDashboardController } from "../controllers/admin-dashboard.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import { AdminDashboardChartQuerySchema } from "../validators/admin-dashboard.validator";

const router = Router();
const controller = apiContainer.get<AdminDashboardController>(
	TYPES.Controllers.AdminDashboard,
);

router.use(verifySession, authorizeRoles(["ADMIN", "SUPER_ADMIN"]));

router.get(ROUTES.ADMIN_DASHBOARD.ROOT, controller.getDashboard);
router.get(
	ROUTES.ADMIN_DASHBOARD.USER_GROWTH,
	validate({ query: AdminDashboardChartQuerySchema }),
	controller.getUserGrowth,
);
router.get(
	ROUTES.ADMIN_DASHBOARD.REVENUE_ANALYTICS,
	validate({ query: AdminDashboardChartQuerySchema }),
	controller.getRevenueAnalytics,
);
router.get(
	ROUTES.ADMIN_DASHBOARD.SESSION_OVERVIEW,
	controller.getSessionOverview,
);

export { router as adminDashboardRouter };
