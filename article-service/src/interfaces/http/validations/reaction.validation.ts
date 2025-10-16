import { z } from "zod";

export const reactionSchema = z.object({
	resourceId: z.string(),
	reaction: z.enum(["like", "dislike"]),
	resourceType: z.enum(["article", "comment"]),
});

export const fetchReactionsParams = z.object({
	resourceId: z.string(),
	page: z.number().min(1).max(100).default(1),
	limit: z.number().min(1).max(100).default(10),
});
