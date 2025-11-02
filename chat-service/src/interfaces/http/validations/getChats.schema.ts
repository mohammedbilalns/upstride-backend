import z from "zod";

export const getChatsSchema = z.object({
	userIds: z.array(z.string()).length(2),
	page: z.coerce.number(),
	limit: z.coerce.number(),
});
