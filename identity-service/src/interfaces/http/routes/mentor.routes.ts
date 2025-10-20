import { Router } from "express";
import { createMentorController } from "../compositions/mentor.composition";
import { rateLimiter } from "../middlewares";
import { authMiddleware } from "../middlewares/auth.middleware";

export function createMentorRouter() {
	const router = Router();
	const mentorController = createMentorController();

	router.get("/:expertiseId", mentorController.fetchMentorsByExpertiseId);
	router.use(authMiddleware());
	router.post(
		"/",
		rateLimiter(2, 60, ["ip", "route"]),
		mentorController.createMentor,
	);
	router.post("/approve", mentorController.appoveMentor);
	router.post("/reject", mentorController.rejectMentor);
	router.get("/details", mentorController.getMentor);
	router.put("/", mentorController.updateMentor);
	router.get("/", mentorController.fetchMentors);
	router.get(
		"/by-expertise-and-skill",
		mentorController.fetchMentorsByExpertiseAndSkill,
	);
	router.get("/:mentorId", mentorController.fetchMentorDetails);

	return router;
}
