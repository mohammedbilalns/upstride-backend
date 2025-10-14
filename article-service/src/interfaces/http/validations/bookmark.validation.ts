import z from "zod";

export const fetchBookMarksParamsSchema = z.object({
	page: z.coerce.number().min(1).max(100).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	query: z.string().default(""),
});

export const createBookMarkSchema = z.object({
	articleId: z.string(),
})
