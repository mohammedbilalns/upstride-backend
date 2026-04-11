import { Router } from "express";
import { apiContainer } from "../../../main/api.container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { MentorController } from "../controllers/mentor.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	MentorApplicationsQuerySchema,
	MentorDiscoveryQuerySchema,
	MentorIdParamSchema,
	RegisterMentorSchema,
	RejectMentorBodySchema,
	ResubmitMentorSchema,
	UpdateMentorProfileBodySchema,
} from "../validators/mentor.validator";

const mentorRouter = Router();
const mentorController = apiContainer.get<MentorController>(
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
	authorizeRoles(["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"]),
	validate({ params: MentorIdParamSchema }),
	mentorController.getPublicProfile,
);

mentorRouter.patch(
	ROUTES.MENTOR.PROFILE,
	verifySession,
	authorizeRoles(["MENTOR"]),
	validate({ body: UpdateMentorProfileBodySchema }),
	mentorController.updateProfile,
);

mentorRouter.post(
	ROUTES.MENTOR.REGISTER,
	verifySession,
	authorizeRoles(["USER"]),
	validate({ body: RegisterMentorSchema }),
	mentorController.register,
);

mentorRouter.patch(
	ROUTES.MENTOR.RESUBMIT,
	verifySession,
	authorizeRoles(["USER"]),
	validate({ body: ResubmitMentorSchema }),
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
	validate({ params: MentorIdParamSchema, body: RejectMentorBodySchema }),
	mentorController.rejectApplication,
);

export { mentorRouter };
