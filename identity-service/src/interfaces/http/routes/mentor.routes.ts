import { Router } from "express";
import { createMentorController } from "../compositions/mentor.composition";
import { authMiddleware } from "../middlewares/auth.middleware";

export function createMentorRoutes() {
  const router = Router();
  const mentorController = createMentorController();

  router.use(authMiddleware());
  router.post("/", mentorController.createMentor);
  router.post("/approve", mentorController.appoveMentor);
  router.post("/reject", mentorController.rejectMentor);
  router.put("/", mentorController.updateMentor);
  router.get("/", mentorController.fetchMentors);
  router.get(
    "/by-expertise-and-skill",
    mentorController.fetchMentorsByExpertiseAndSkill,
  );

  return router;
}
