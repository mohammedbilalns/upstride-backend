import z from "zod";

export const getChatsSchema = z.object({
	recieverId: z.string(),
	page: z.coerce.number(),
	limit: z.coerce.number(),
});
