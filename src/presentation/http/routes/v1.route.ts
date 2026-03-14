import { Router } from "express";
import { ROUTES } from "../constants";
import {
	authRouter,
	catalogRouter,
	fileRouter,
	mentorRouter,
	profileRouter,
	userManagementRouter,
} from ".";

export const router = Router();

router.use("/test", async (_req, res) => {
	res.send("Running..");
});

router.use(ROUTES.AUTH.BASE, authRouter);
router.use(ROUTES.PROFILE.BASE, profileRouter);
router.use(ROUTES.CATALOG.BASE, catalogRouter);
router.use(ROUTES.USER_MANAGEMENT.BASE, userManagementRouter);
router.use(ROUTES.STORAGE.BASE, fileRouter);
router.use(ROUTES.MENTOR.BASE, mentorRouter);
