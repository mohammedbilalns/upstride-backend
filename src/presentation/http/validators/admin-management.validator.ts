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

export const AdminIdParamSchema = z.object({
	id: z.string().min(1, "Admin ID is required"),
});

export const CreateAdminBodySchema = z.object({
	email: z.email().trim(),
	password: passwordSchema,
});
