import { Router } from "express";
import { createConnectionController } from "../compositions/connection.composition";
import { authMiddleware, authorizeRoles } from "../middlewares";

export function createConnectionRouter() {
  const router = Router();
  const connectionController = createConnectionController();
 
  router.use(authMiddleware());
  router.get("/followers", authorizeRoles("mentor"), connectionController.fetchFollowers);
  router.get("/recent-activity", connectionController.fetchRecentActivity);

  router.use(authorizeRoles("user", "mentor"));
  router.post("/follow", connectionController.followMentor);
  router.get(
    "/following",
    connectionController.fetchFollowing,
  );
  router.post("/unfollow", connectionController.unfollowMentor);
  router.get("/suggested", connectionController.fetchSuggestedMentors)


	return router;
}
