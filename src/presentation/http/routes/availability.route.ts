import { Router } from "express";
import { apiContainer } from "../../../main/api.container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { AvailabilityController } from "../controllers/availability.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	AvailabilityIdParamSchema,
	CreateAvailabilityBodySchema,
	GetMentorAvailabilitiesQuerySchema,
	UpdateAvailabilityBodySchema,
	UpdateAvailabilityParamsSchema,
} from "../validators/availability.validator";

const availabilityRouter = Router();
const availabilityController = apiContainer.get<AvailabilityController>(
	TYPES.Controllers.Availability,
);

availabilityRouter.post(
	ROUTES.AVAILABILITY.ROOT,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ body: CreateAvailabilityBodySchema }),
	availabilityController.createAvailability,
);

availabilityRouter.post(
	ROUTES.AVAILABILITY.CHECK_CREATE,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ body: CreateAvailabilityBodySchema }),
	availabilityController.checkAndCreateAvailability,
);

availabilityRouter.get(
	ROUTES.AVAILABILITY.MENTOR,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ query: GetMentorAvailabilitiesQuerySchema }),
	availabilityController.getMentorAvailabilities,
);

availabilityRouter.put(
	ROUTES.AVAILABILITY.BY_ID(":id"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({
		params: UpdateAvailabilityParamsSchema,
		body: UpdateAvailabilityBodySchema,
	}),
	availabilityController.updateAvailability,
);

availabilityRouter.put(
	"/reenable/:id",
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: AvailabilityIdParamSchema }),
	availabilityController.reenableAvailability,
);

availabilityRouter.patch(
	ROUTES.AVAILABILITY.REENABLE(":id"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: AvailabilityIdParamSchema }),
	availabilityController.reenableAvailability,
);

availabilityRouter.patch(
	ROUTES.AVAILABILITY.CHECK_REENABLE(":id"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: AvailabilityIdParamSchema }),
	availabilityController.checkAndReenableAvailability,
);

availabilityRouter.delete(
	ROUTES.AVAILABILITY.BY_ID(":id"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: AvailabilityIdParamSchema }),
	availabilityController.deleteAvailability,
);

export { availabilityRouter };
