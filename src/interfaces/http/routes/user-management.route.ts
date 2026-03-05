import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import type { UserManagementController } from "../controllers/user-management.controller";
import { authorizeRoles } from "../middlewares/role.middleware";
import { verifySession } from "../middlewares/session.middleware";

import { validate } from "../middlewares/validator.middleware";
import { UsersQuerySchema } from "../validators/user-management.validator";

const router = Router();
const controller = container.get<UserManagementController>(
	TYPES.Controllers.UserManagement,
);

router.use(verifySession, authorizeRoles(["ADMIN", "SUPER_ADMIN"]));
router.get(
	"/",
	validate({ query: UsersQuerySchema }),
	controller.getUsers.bind(controller),
);

export default router;
