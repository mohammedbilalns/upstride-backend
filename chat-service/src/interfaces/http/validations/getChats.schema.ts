import z from "zod";

export const getChatsSchema = z.object({
	page: z.coerce.number(),
	limit: z.coerce.number(),
});

export const getChatsParamsSchema = z.object({
  chatId: z.string()
})
