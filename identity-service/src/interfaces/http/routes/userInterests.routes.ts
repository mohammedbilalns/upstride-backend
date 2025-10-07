import { Router } from "express";
import { createInterestsController } from "../compositions/interests.composition";
import { authMiddleware, authorizeRoles } from "../middlewares";

export function createUserInterestsRouter() {
	const router = Router();
	const interestsController = createInterestsController();

	router.use(authMiddleware(), authorizeRoles("user", "mentor"));

	router.get(
		"/:userId/interestedExpertises",
		interestsController.fetchInterests,
	);

	return router;
}
