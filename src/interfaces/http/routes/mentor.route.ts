import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants/route-paths";
import type { MentorController } from "../controllers/mentor.controller";
import { authorizeRoles } from "../middlewares/role.middleware";
import { verifySession } from "../middlewares/session.middleware";

const mentorRouter = Router();
const mentorController = container.get<MentorController>(
	TYPES.Controllers.Mentor,
);

mentorRouter.get(
	ROUTES.MENTOR.REGISTRATION_INFO,
	verifySession,
	authorizeRoles(["USER"]),
	mentorController.getRegistrationInfo,
);

export { mentorRouter };
