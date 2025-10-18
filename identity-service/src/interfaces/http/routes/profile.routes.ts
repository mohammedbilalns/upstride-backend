import { Router } from "express";
import { createProfileController } from "../compositions/profile.composition";
import { authMiddleware, authorizeRoles } from "../middlewares";

export function createProfileRoutes() {
	const router = Router();
	const profileController = createProfileController();


	router.get("/:profileId", profileController.fetchProfileById);
	router.use(authMiddleware());
	router.use(authorizeRoles("user","mentor"));
  router.post("/", profileController.updateProfile);
  router.put("/change-password", profileController.changePassword);

	return router;
}
