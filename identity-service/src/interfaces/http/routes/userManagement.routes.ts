import { Router } from "express";
import { createUserManagementController } from "../compositions/userManagement.composition";

export function createUserManagementRouter() {
  const router = Router();
  const userManagementController = createUserManagementController();

  router.get("/users", userManagementController.fetchUsers);
  router.post("/users/block", userManagementController.blockUser);
  router.post("/users/unblock", userManagementController.unblockUser);

  return router;
}
