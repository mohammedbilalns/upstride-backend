import { Router } from "express";

export const router = Router();

router.use("/test", async (_req, res) => {
	res.send("Running..");
});
