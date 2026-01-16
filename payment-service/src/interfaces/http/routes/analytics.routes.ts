import { Router } from "express";
import { createAnalyticsController } from "../compositions/analytics.composition";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";

export function createAnalyticsRoutes(): Router {
  const router = Router();
  const analyticsController = createAnalyticsController();

  // Get platform analytics (admin only)
  router.get(
    "/platform",
    authMiddleware(), 
    authorizeRoles("admin", "superadmin"),
    analyticsController.getPlatformAnalytics,
  );

  return router;
}
