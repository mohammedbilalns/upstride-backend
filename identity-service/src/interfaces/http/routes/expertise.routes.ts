import { Router } from "express";
import { createExpertiseController } from "../compositions/expertise.composition";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";

export function createExpertiseRouter() {
  const router = Router();
  const expertiseController = createExpertiseController();

  router.use(authMiddleware());
  router.get(
    "/",
    authorizeRoles("user", "admin", "superadmin"),
    expertiseController.fetchExpertises,
  );
	router.put("/:expertiseId/verify", expertiseController.verifyExpertise)
  router.post(
    "/:expertiseId/skills",
    authorizeRoles("user", "admin", "superadmin"),
    expertiseController.createSkill,
  );
  router.get(
    "/:expertiseId/skills",
    authorizeRoles("user", "admin", "superadmin"),
    expertiseController.fetchSkills,
  );

  router.use(authorizeRoles("admin", "superadmin"));
  router.post("/", expertiseController.createExpertise);
  router.put("/:expertiseId", expertiseController.udpateExpertise);
  router.put("/skills/:skillId", expertiseController.updateSkill);

  return router;
}
