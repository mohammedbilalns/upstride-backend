import { Router } from "express";
import { ROUTES } from "../constants/route-paths";
import { authRouter } from "./auth.route";

export const router = Router();

router.use("/test", async (_req, res) => {
	res.send("Running..");
});

router.use(ROUTES.AUTH.BASE, authRouter);
