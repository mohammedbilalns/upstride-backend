import { Router } from "express";
import { createExpertiseController } from "../compositions/expertise.composition";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";

export function createExpertiseRouter() {
	const router = Router();
	const expertiseController = createExpertiseController();

	router.get(
		"/",

		expertiseController.fetchExpertises,
	);
	router.get("/:expertiseId/skills", expertiseController.fetchSkills);

	router.use(authMiddleware());
	router.put("/:expertiseId/verify", expertiseController.verifyExpertise);
	router.post(
		"/:expertiseId/skills",
		authorizeRoles("user", "admin", "superadmin"),
		expertiseController.createSkill,
	);

	router.put("/skills/:skillId/verify", expertiseController.verifySkill);

	router.use(authorizeRoles("admin", "superadmin"));
	router.post("/", expertiseController.createExpertise);
	router.put("/:expertiseId", expertiseController.udpateExpertise);
	router.put("/skills/:skillId", expertiseController.updateSkill);
	router.get("/skills", expertiseController.fetchSkillsFromMultipleExpertise);

	return router;
}
