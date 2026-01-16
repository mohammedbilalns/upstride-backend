import { Router } from "express";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";
import { createWalletsController } from "../compositions/wallets.composition";

export function createWalletRoutes(): Router {
    const router = Router();
    const walletsController = createWalletsController();


    router.use(authMiddleware(), authorizeRoles("mentor", "user"));
    // Get wallet balance
    router.get("/balance", walletsController.getBalance);

    // Get combined wallet details
    router.get("/details", walletsController.getWalletDetails);

    return router;
}
