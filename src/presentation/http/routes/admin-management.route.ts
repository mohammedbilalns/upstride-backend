import { Router } from "express";
import { container } from "../../../main/container";
import { ROUTES } from "../constants";
import { AdminManagementController } from "../controllers/admin-management.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	AdminIdParamSchema,
	AdminsQuerySchema,
	CreateAdminBodySchema,
} from "../validators/admin-management.validator";

const router = Router();
const controller = container.get(AdminManagementController);

router.use(verifySession, authorizeRoles(["SUPER_ADMIN"]));

router.get(
	ROUTES.ADMIN_MANAGEMENT.FETCH_ADMINS,
	validate({ query: AdminsQuerySchema }),
	controller.getAdmins,
);

router.post(
	ROUTES.ADMIN_MANAGEMENT.CREATE_ADMIN,
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

export { router as adminManagementRouter };
