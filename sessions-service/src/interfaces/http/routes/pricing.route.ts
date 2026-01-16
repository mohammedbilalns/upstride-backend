import { Router } from "express";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";
import { createPricingController } from "../compositions/pricing.composition";

export function createPricingRoutes(): Router {
    const router = Router();
    const pricingController = createPricingController();

    router.use(authMiddleware(), authorizeRoles("mentor"))

    /**
     * Sets the pricing configuration for a mentor.
     */
    router.post(
        "/config",
        pricingController.setPricingConfig,
    );

    /**
     * Retrieves the pricing configuration for a specific mentor.
     */
    router.get(
        "/config/:mentorId",
        pricingController.getPricingConfig,
    );

    return router;
}
