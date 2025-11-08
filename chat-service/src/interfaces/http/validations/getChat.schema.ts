import z from "zod";

export const getChatSchema = z.object({
	page: z.coerce.number(),
	limit: z.coerce.number(),
});
