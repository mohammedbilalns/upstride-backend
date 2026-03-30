import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { AvailabilityController } from "../controllers/availability.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	availabilityIdParamSchema,
	createAvailabilitySchema,
	getMentorAvailabilitiesSchema,
	updateAvailabilitySchema,
} from "../validators/availability.validator";

const availabilityRouter = Router();
const availabilityController = container.get<AvailabilityController>(
	TYPES.Controllers.Availability,
);

availabilityRouter.post(
	ROUTES.AVAILABILITY.ROOT,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate(createAvailabilitySchema),
	availabilityController.createAvailability,
);

availabilityRouter.post(
	ROUTES.AVAILABILITY.CHECK_CREATE,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate(createAvailabilitySchema),
	availabilityController.checkAndCreateAvailability,
);

availabilityRouter.get(
	ROUTES.AVAILABILITY.MENTOR,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate(getMentorAvailabilitiesSchema),
	availabilityController.getMentorAvailabilities,
);

availabilityRouter.put(
	ROUTES.AVAILABILITY.BY_ID(":id"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate(updateAvailabilitySchema),
	availabilityController.updateAvailability,
);

availabilityRouter.put(
	"/reenable/:id",
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate(availabilityIdParamSchema),
	availabilityController.reenableAvailability,
);

availabilityRouter.patch(
	ROUTES.AVAILABILITY.REENABLE(":id"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate(availabilityIdParamSchema),
	availabilityController.reenableAvailability,
);

availabilityRouter.patch(
	ROUTES.AVAILABILITY.CHECK_REENABLE(":id"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate(availabilityIdParamSchema),
	availabilityController.checkAndReenableAvailability,
);

availabilityRouter.delete(
	ROUTES.AVAILABILITY.BY_ID(":id"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate(availabilityIdParamSchema),
	availabilityController.deleteAvailability,
);

export { availabilityRouter };
