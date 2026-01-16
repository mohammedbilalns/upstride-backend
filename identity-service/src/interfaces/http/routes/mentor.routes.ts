import { Router } from "express";
import { createMentorController } from "../compositions/mentor.composition";
import { rateLimiter } from "../middlewares";
import { authMiddleware } from "../middlewares/auth.middleware";

export function createMentorRouter() {
	const router = Router();
	const mentorController = createMentorController();

	router.get(
		"/expertise/:expertiseId",
		mentorController.fetchMentorsByExpertiseId,
	);
	router.get(
		"/basic/:mentorId",
		mentorController.getBasicProfile
	);
	router.use(authMiddleware());
	router.post(
		"/",
		rateLimiter(2, 60, ["ip", "route"]),
		mentorController.createMentor,
	);
	router.post("/approve", mentorController.appoveMentor);
	router.post("/reject", mentorController.rejectMentor);
	router.put("/", mentorController.updateMentor);
	// normal user
	router.get("/user", mentorController.fetchMentorsForUser);
	// admin

	router.get("/getMe", mentorController.getMe);
	router.get("/", mentorController.fetchMentors);
	router.get("/:mentorId", mentorController.fetchMentorDetails);

	return router;
}
