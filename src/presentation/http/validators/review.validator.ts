import { z } from "zod";
import {
	buildObjectIdParamSchema,
	pageSchema,
} from "../../../shared/validators";

export const ReviewBookingParamSchema = buildObjectIdParamSchema("bookingId");
export type ReviewBookingParam = z.infer<typeof ReviewBookingParamSchema>;

export const ReviewMentorParamSchema = buildObjectIdParamSchema("mentorId");
export type ReviewMentorParam = z.infer<typeof ReviewMentorParamSchema>;

export const CreateReviewBodySchema = z.object({
	rating: z.coerce.number().int().min(1).max(5),
	comment: z.string().trim().min(5, "Comment must be at least 5 characters"),
});

export type CreateReviewBody = z.infer<typeof CreateReviewBodySchema>;

export const MentorReviewsQuerySchema = z.object({
	page: pageSchema,
});

export type MentorReviewsQuery = z.infer<typeof MentorReviewsQuerySchema>;
