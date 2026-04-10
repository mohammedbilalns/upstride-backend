import { z } from "zod";
import {
	limitSchema,
	pageSchema,
	passwordSchema,
} from "../../../shared/validators";

export const AdminsQuerySchema = z.object({
	page: pageSchema,
	limit: limitSchema,
	search: z.string().optional(),
	status: z.enum(["active", "blocked"]).optional(),
	sort: z.enum(["recent", "old"]).default("recent"),
});
export type AdminsQuery = z.infer<typeof AdminsQuerySchema>;

export const AdminIdParamSchema = z.object({
	id: z.string().min(1, "Admin ID is required"),
});
export type AdminIdParam = z.infer<typeof AdminIdParamSchema>;

export const CreateAdminBodySchema = z.object({
	email: z.email().trim(),
	password: passwordSchema,
});
export type CreateAdminBody = z.infer<typeof CreateAdminBodySchema>;
