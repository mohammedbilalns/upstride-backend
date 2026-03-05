import { Router } from "express";
import { ROUTES } from "../constants/route-paths";
import { authRouter } from "./auth.route";
import { catalogRouter } from "./catalog.route";
import userManagementRouter from "./user-management.route";

export const router = Router();

router.use("/test", async (_req, res) => {
	res.send("Running..");
});

router.use(ROUTES.AUTH.BASE, authRouter);
router.use(ROUTES.CATALOG.BASE, catalogRouter);
router.use(ROUTES.USER_MANAGEMENT.BASE, userManagementRouter);
