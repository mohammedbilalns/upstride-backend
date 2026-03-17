import { z } from "zod";
import { passwordSchema } from "./common/password.schema";

export const AdminsQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce
		.number()
		.int()
		.refine((val: number) => [10, 20, 50].includes(val), {
			message: "Limit must be 10, 20, or 50",
		})
		.default(10),
	search: z.string().optional(),
	status: z.enum(["active", "blocked"]).optional(),
	sort: z.enum(["recent", "old"]).default("recent"),
});

export const AdminIdParamSchema = z.object({
	id: z.string().min(1, "Admin ID is required"),
});

export const CreateAdminBodySchema = z.object({
	email: z.email().trim(),
	password: passwordSchema,
});
