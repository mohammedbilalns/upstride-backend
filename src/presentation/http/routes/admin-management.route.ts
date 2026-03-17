import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { AdminManagementController } from "../controllers/admin-management.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	AdminIdParamSchema,
	AdminsQuerySchema,
	CreateAdminBodySchema,
} from "../validators/admin-management.validator";

const router = Router();
const controller = container.get<AdminManagementController>(
	TYPES.Controllers.AdminManagement,
);

router.use(verifySession, authorizeRoles(["SUPER_ADMIN"]));

router.get(
	ROUTES.ADMIN_MANAGEMENT.FETCH_ADMINS,
	validate({ query: AdminsQuerySchema }),
	controller.getAdmins.bind(controller),
);

router.post(
	ROUTES.ADMIN_MANAGEMENT.CREATE_ADMIN,
	validate({ body: CreateAdminBodySchema }),
	controller.createAdmin.bind(controller),
);

router.patch(
	"/:id/block",
	validate({ params: AdminIdParamSchema }),
	controller.blockAdmin.bind(controller),
);

router.patch(
	"/:id/unblock",
	validate({ params: AdminIdParamSchema }),
	controller.unblockAdmin.bind(controller),
);

export default router;
