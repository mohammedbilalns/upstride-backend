import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { UserManagementController } from "../controllers/user-management.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	UserIdParamSchema,
	UsersQuerySchema,
} from "../validators/user-management.validator";

const router = Router();
const controller = container.get<UserManagementController>(
	TYPES.Controllers.UserManagement,
);

router.use(verifySession, authorizeRoles(["ADMIN", "SUPER_ADMIN"]));

router.get(
	ROUTES.USER_MANAGEMENT.FETCH_USERS,
	validate({ query: UsersQuerySchema }),
	controller.getUsers.bind(controller),
);

router.patch(
	"/:id/block",
	validate({ params: UserIdParamSchema }),
	controller.blockUser.bind(controller),
);
router.patch(
	"/:id/unblock",
	validate({ params: UserIdParamSchema }),
	controller.unblockUser.bind(controller),
);

export { router as userManagementRouter };
