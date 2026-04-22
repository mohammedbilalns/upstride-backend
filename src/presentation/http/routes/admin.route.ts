import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { ROUTES } from "../constants";
import { AdminController } from "../controllers/admin.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	AdminIdParamSchema,
	AdminsQuerySchema,
	CreateAdminBodySchema,
} from "../validators/admins.validator";

const router = Router();
const controller = apiContainer.get(AdminController);

router.use(verifySession, authorizeRoles(["SUPER_ADMIN"]));

router.get(
	ROUTES.ADMINS.FETCH_ADMINS,
	validate({ query: AdminsQuerySchema }),
	controller.getAdmins,
);

router.post(
	ROUTES.ADMINS.CREATE_ADMIN,
	validate({ body: CreateAdminBodySchema }),
	controller.createAdmin,
);

router.patch(
	"/:id/block",
	validate({ params: AdminIdParamSchema }),
	controller.blockAdmin,
);

router.patch(
	"/:id/unblock",
	validate({ params: AdminIdParamSchema }),
	controller.unblockAdmin,
);

export { router as adminsRouter };
