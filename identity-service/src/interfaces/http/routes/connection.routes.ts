import { Router } from "express";
import { createConnectionController } from "../compositions/connection.composition";
import { authMiddleware, authorizeRoles } from "../middlewares";

export function createConnectionRouter() {
	const router = Router();
	const connectionController = createConnectionController();

	router.use(authMiddleware());
	router.get(
		"/following",
		authorizeRoles("mentor"),
		connectionController.fetchFollowing,
	);

	router.use(authorizeRoles("user", "mentor"));
	router.post("/follow", connectionController.followMentor);
	router.post("/unfollow", connectionController.unfollowMentor);

	router.get("/followers", connectionController.fetchFollowers);

	return router;
}
