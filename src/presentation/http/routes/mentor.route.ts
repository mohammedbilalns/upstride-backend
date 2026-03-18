import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { MentorController } from "../controllers/mentor.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	MentorApplicationsQuerySchema,
	MentorDiscoveryQuerySchema,
	MentorIdParamSchema,
	registerMentorSchema,
	rejectMentorBodySchema,
	resubmitMentorSchema,
	updateMentorProfileBodySchema,
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

mentorRouter.get(
	ROUTES.MENTOR.PROFILE,
	verifySession,
	authorizeRoles(["MENTOR"]),
	mentorController.getProfile,
);

mentorRouter.get(
	ROUTES.MENTOR.PUBLIC_PROFILE(":id"),
	verifySession,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ params: MentorIdParamSchema }),
	mentorController.getPublicProfile,
);

mentorRouter.patch(
	ROUTES.MENTOR.PROFILE,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ body: updateMentorProfileBodySchema }),
	mentorController.updateProfile,
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
	ROUTES.MENTOR.DISCOVERY,
	verifySession,
	authorizeRoles(["USER", "MENTOR"]),
	validate({ query: MentorDiscoveryQuerySchema }),
	mentorController.getDiscovery,
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
	validate({ params: MentorIdParamSchema, body: rejectMentorBodySchema }),
	mentorController.rejectApplication,
);

export { mentorRouter };
