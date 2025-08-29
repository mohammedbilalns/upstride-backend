import { Router } from "express";
import { createMentorController } from "../compositions/mentor.composition";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";

export function createMentorRoutes() {
  const router = Router();
  const mentorController = createMentorController();

  router.use(authMiddleware);
  router.post("/", authorizeRoles("user"), mentorController.createMentor);
  router.post(
    "/update-status",
    authorizeRoles("admin"),
    mentorController.approveMentor,
  );

  router.get(
    "/",
    authorizeRoles("admin", "user"),
    mentorController.fetchMentors,
  );
  return router;
}
