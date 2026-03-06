import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants/route-paths";
import type { MentorController } from "../controllers/mentor.controller";
import { authorizeRoles } from "../middlewares/role.middleware";
import { verifySession } from "../middlewares/session.middleware";
import { validate } from "../middlewares/validator.middleware";
import {
	MentorApplicationsQuerySchema,
	MentorIdParamSchema,
	registerMentorSchema,
	rejectMentorSchema,
	resubmitMentorSchema,
} from "../validators/mentor.validator";

const mentorRouter = Router();
const mentorController = container.get<MentorController>(
	TYPES.Controllers.Mentor,
);

mentorRouter.get(
	ROUTES.MENTOR.REGISTRATION_INFO,
	verifySession,
	authorizeRoles(["USER", "MENTOR"]),
	mentorController.getRegistrationInfo,
);

mentorRouter.post(
	ROUTES.MENTOR.REGISTER,
	verifySession,
	authorizeRoles(["USER"]),
	validate({ body: registerMentorSchema }),
	mentorController.register,
);

mentorRouter.patch(
	ROUTES.MENTOR.RESUBMIT,
	verifySession,
	authorizeRoles(["USER"]),
	validate({ body: resubmitMentorSchema }),
	mentorController.resubmit,
);

mentorRouter.get(
	ROUTES.MENTOR.APPLICATIONS,
	verifySession,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ query: MentorApplicationsQuerySchema }),
	mentorController.getApplications,
);

mentorRouter.patch(
	ROUTES.MENTOR.APPROVE(":id"),
	verifySession,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ params: MentorIdParamSchema }),
	mentorController.approveApplication,
);

mentorRouter.patch(
	ROUTES.MENTOR.REJECT(":id"),
	verifySession,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ params: MentorIdParamSchema, body: rejectMentorSchema }),
	mentorController.rejectApplication,
);

export { mentorRouter };
