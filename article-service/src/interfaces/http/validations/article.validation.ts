import {z} from "zod"

export const createArticleSchema = z.object({
	featuredImage: z.string(),
	title: z.string().min(5,"Title must be at least 5 characters").max(200,"Title must be less than 200 characters"),
	category: z.string(),
	topics: z.array(z.string()).max(5),
	tags: z.array(z.string()).max(5),
	content: z.string().min(10,"Content must be at least 10 characters").max(5000,"Content must be less than 5000 characters"),
})


export const updateArticleSchema = z.object({
	id: z.string(),
	title: z.string().min(5,"Title must be at least 5 characters").max(200,"Title must be less than 200 characters").optional(),
	featuredImage: z.string().optional(),
	category: z.string().optional(),
	topics: z.array(z.string()).max(5).optional(),
	tags: z.array(z.string()).max(5).optional(),
	content: z.string().min(10,"Content must be at least 10 characters").max(5000,"Content must be less than 5000 characters"),
})


export const fetchArticlesSchema = z.object({
	page: z.number().min(1).max(100).default(1),
	limit: z.number().min(1).max(100).default(10),
	sortBy: z.literal("asc","desc").optional(),
	author: z.string().optional(),
	category: z.string().optional(),
	topic: z.string().optional(),
	tag: z.string().optional(),
	query: z.string().default(''),
})

