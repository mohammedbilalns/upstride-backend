import { Router } from "express";
import { createProfileController } from "../compositions/profile.composition";
import { authMiddleware, authorizeRoles } from "../middlewares";

export function createProfileRouter() {
	const router = Router();
	const profileController = createProfileController();

	router.use(authMiddleware());
	router.use(authorizeRoles("user", "mentor"));
	router.get("/:profileId", profileController.fetchProfileById);
	router.put("/", profileController.updateProfile);
	router.put("/change-password", profileController.changePassword);

	return router;
}
