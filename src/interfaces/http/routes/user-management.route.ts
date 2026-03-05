import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants/route-paths";
import type { UserManagementController } from "../controllers/user-management.controller";
import { authorizeRoles } from "../middlewares/role.middleware";
import { verifySession } from "../middlewares/session.middleware";
import { validate } from "../middlewares/validator.middleware";
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

export default router;
