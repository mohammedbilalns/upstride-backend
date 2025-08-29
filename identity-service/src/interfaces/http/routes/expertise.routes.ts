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
  router.post(
    "/skill",
    authorizeRoles("user", "admin", "superadmin"),
    expertiseController.createSkill,
  );
  router.get(
    "/skill",
    authorizeRoles("user", "admin", "superadmin"),
    expertiseController.fetchSkills,
  );

  router.use(authorizeRoles("admin", "superadmin"));
  router.post("/", expertiseController.createExpertise);
  router.put("/:expertiseId", expertiseController.udpateExpertise);
  router.put("/skill", expertiseController.updateSkill);

  return router;
}
