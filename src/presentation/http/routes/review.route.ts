import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { ReviewController } from "../controllers/review.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	CreateReviewBodySchema,
	MentorReviewsQuerySchema,
	ReviewBookingParamSchema,
	ReviewMentorParamSchema,
} from "../validators/review.validator";

const reviewRouter = Router();
const reviewController = apiContainer.get<ReviewController>(
	TYPES.Controllers.Review,
);

reviewRouter.post(
	ROUTES.REVIEWS.BOOKING(":bookingId"),
	verifySession,
	authorizeRoles(["USER"]),
	validate({ params: ReviewBookingParamSchema, body: CreateReviewBodySchema }),
	reviewController.createReview,
);

reviewRouter.get(
	ROUTES.REVIEWS.MENTOR(":mentorId"),
	verifySession,
	authorizeRoles(["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"]),
	validate({
		params: ReviewMentorParamSchema,
		query: MentorReviewsQuerySchema,
	}),
	reviewController.getMentorReviews,
);

export { reviewRouter };
