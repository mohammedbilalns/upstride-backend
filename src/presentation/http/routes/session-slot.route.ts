import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { SessionSlotController } from "../controllers/session-slot.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	availableSlotsQuerySchema,
	createCustomSlotBodySchema,
	generateSlotsBodySchema,
	getMentorSlotsQuerySchema,
	mentorIdParamSchema,
	slotIdParamSchema,
} from "../validators/session-slot.validator";

const sessionSlotRouter = Router();
const sessionSlotController = container.get<SessionSlotController>(
	TYPES.Controllers.SessionSlot,
);

sessionSlotRouter.get(
	ROUTES.SESSION_SLOTS.ROOT,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ query: getMentorSlotsQuerySchema }),
	sessionSlotController.getSlots,
);

sessionSlotRouter.get(
	ROUTES.SESSION_SLOTS.PUBLIC_AVAILABLE(":mentorId"),
	verifySession,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: mentorIdParamSchema, query: availableSlotsQuerySchema }),
	sessionSlotController.getPublicAvailableSlots,
);

sessionSlotRouter.post(
	ROUTES.SESSION_SLOTS.CUSTOM,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ body: createCustomSlotBodySchema }),
	sessionSlotController.createCustomSlot,
);

sessionSlotRouter.patch(
	ROUTES.SESSION_SLOTS.CANCEL(":slotId"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: slotIdParamSchema }),
	sessionSlotController.cancelSlot,
);

sessionSlotRouter.patch(
	ROUTES.SESSION_SLOTS.ENABLE(":slotId"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: slotIdParamSchema }),
	sessionSlotController.enableSlot,
);

sessionSlotRouter.delete(
	ROUTES.SESSION_SLOTS.BY_ID(":slotId"),
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ params: slotIdParamSchema }),
	sessionSlotController.deleteSlot,
);

sessionSlotRouter.post(
	ROUTES.SESSION_SLOTS.GENERATE,
	verifySession,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ body: generateSlotsBodySchema }),
	sessionSlotController.generateSlots,
);

export { sessionSlotRouter };
