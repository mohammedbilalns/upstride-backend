import { Router } from "express";
import { createExpertiseController } from "../compositions/expertise.composition";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";

export function createExpertiseRouter() {
	const router = Router();
	const expertiseController = createExpertiseController();

	router.get("/", expertiseController.fetchExpertises);
	router.get("/:expertiseId/skills", expertiseController.fetchSkills);

	router.use(authMiddleware());
	router.post(
		"/:expertiseId/skills",
		authorizeRoles("user", "admin", "superadmin"),
		expertiseController.createSkill,
	);

	router.get("/active", expertiseController.fetchActiveExpertisesAndSkills);

	router.use(authorizeRoles("admin", "superadmin"));
	router.get("/admin", expertiseController.fetchExpertises);
	router.get("/:expertiseId/skills/admin", expertiseController.fetchSkills);
	router.post("/", expertiseController.createExpertise);
	router.put("/skills/:skillId/verify", expertiseController.verifySkill);
	router.put("/:expertiseId/verify", expertiseController.verifyExpertise);
	router.put("/:expertiseId", expertiseController.udpateExpertise);
	router.put("/skills/:skillId", expertiseController.updateSkill);
	router.get("/skills", expertiseController.fetchSkillsFromMultipleExpertise);

	return router;
}
