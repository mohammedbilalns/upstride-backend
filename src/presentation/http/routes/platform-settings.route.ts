import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { PlatformSettingsController } from "../controllers/platform-settings.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	UpdateContentSettingsBodySchema,
	UpdateEconomySettingsBodySchema,
	UpdateMentorSettingsBodySchema,
	UpdateSessionSettingsBodySchema,
} from "../validators/platform-settings";

const router = Router();
const controller = container.get<PlatformSettingsController>(
	TYPES.Controllers.PlatformSettings,
);

router.use(verifySession, authorizeRoles(["ADMIN", "SUPER_ADMIN"]));

router.get(
	ROUTES.PLATFORM_SETTINGS.FETCH,
	controller.fetchAll.bind(controller),
);

router.patch(
	ROUTES.PLATFORM_SETTINGS.ECONOMY,
	validate({ body: UpdateEconomySettingsBodySchema }),
	controller.updateEconomy.bind(controller),
);

router.patch(
	ROUTES.PLATFORM_SETTINGS.MENTORS,
	validate({ body: UpdateMentorSettingsBodySchema }),
	controller.updateMentors.bind(controller),
);

router.patch(
	ROUTES.PLATFORM_SETTINGS.CONTENT,
	validate({ body: UpdateContentSettingsBodySchema }),
	controller.updateContent.bind(controller),
);

router.patch(
	ROUTES.PLATFORM_SETTINGS.SESSIONS,
	validate({ body: UpdateSessionSettingsBodySchema }),
	controller.updateSessions.bind(controller),
);

export { router as platformSettingsRouter };
