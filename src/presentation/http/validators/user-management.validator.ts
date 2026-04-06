import { z } from "zod";
import {
	limitSchema,
	pageSchema,
	useridSchema,
} from "../../../shared/validators";

export const UsersQuerySchema = z.object({
	page: pageSchema,
	limit: limitSchema,
	search: z.string().optional(),
	role: z.enum(["USER", "MENTOR"]).optional(),
	status: z.enum(["active", "blocked"]).optional(),
	sort: z.enum(["recent", "old"]).default("recent"),
});
export type UsersQuery = z.infer<typeof UsersQuerySchema>;

export const UserIdParamSchema = z.object({
	id: useridSchema,
});
export type UserIdParam = z.infer<typeof UserIdParamSchema>;
