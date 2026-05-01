import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { ROUTES } from "../constants";
import { UsersManagementController } from "../controllers/user-management.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	BlockUserBodySchema,
	UserIdParamSchema,
	UsersQuerySchema,
} from "../validators/users.validator";

const router = Router();
const controller = apiContainer.get(UsersManagementController);

router.use(verifySession, authorizeRoles(["ADMIN", "SUPER_ADMIN"]));

router.get(
	ROUTES.USERS.FETCH_USERS,
	validate({ query: UsersQuerySchema }),
	controller.getUsers,
);

router.patch(
	ROUTES.USERS.BLOCK(":id"),
	validate({ params: UserIdParamSchema, body: BlockUserBodySchema }),
	controller.blockUser,
);
router.patch(
	ROUTES.USERS.UNBLOCK(":id"),
	validate({ params: UserIdParamSchema }),
	controller.unblockUser,
);

export { router as usersRouter };
