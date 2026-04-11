import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { ROUTES } from "../constants";
import { UserManagementController } from "../controllers/user-management.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	BlockUserBodySchema,
	UserIdParamSchema,
	UsersQuerySchema,
} from "../validators/user-management.validator";

const router = Router();
const controller = apiContainer.get(UserManagementController);

router.use(verifySession, authorizeRoles(["ADMIN", "SUPER_ADMIN"]));

router.get(
	ROUTES.USER_MANAGEMENT.FETCH_USERS,
	validate({ query: UsersQuerySchema }),
	controller.getUsers,
);

router.patch(
	"/:id/block",
	validate({ params: UserIdParamSchema, body: BlockUserBodySchema }),
	controller.blockUser,
);
router.patch(
	"/:id/unblock",
	validate({ params: UserIdParamSchema }),
	controller.unblockUser,
);

export { router as userManagementRouter };
