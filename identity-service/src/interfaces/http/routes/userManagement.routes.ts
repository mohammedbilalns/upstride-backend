import { Router } from "express";
import { createUserManagementController } from "../compositions/userManagement.composition";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";

export function createUserManagementRouter() {
	const router = Router();
	const userManagementController = createUserManagementController();

	router.get("/fetchbyids", userManagementController.fetchByUserIds);
	router.use(authMiddleware(), authorizeRoles("admin", "superadmin"));
	router.get("/", userManagementController.fetchUsers);
	router.post("/block/:userId", userManagementController.blockUser);
	router.post("/unblock/:userId", userManagementController.unblockUser);

	return router;
}
