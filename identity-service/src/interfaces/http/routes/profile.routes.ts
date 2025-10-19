import { Router } from "express";
import { createProfileController } from "../compositions/profile.composition";
import { authMiddleware, authorizeRoles } from "../middlewares";

export function createProfileRoutes() {
	const router = Router();
	const profileController = createProfileController();

	router.use(authMiddleware());
	router.use(authorizeRoles("user", "mentor"));
	router.get("/:profileId", profileController.fetchProfileById);
	router.post("/", profileController.updateProfile);
	router.put("/change-password", profileController.changePassword);

	return router;
}
