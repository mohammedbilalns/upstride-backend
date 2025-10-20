import { z } from "zod";

export const followMentorSchema = z.object({
	mentorId: z.string(),
});
export const unfollowMentorSchema = z.object({
	mentorId: z.string(),
});
