import { z } from "zod";
import {
	buildObjectIdParamSchema,
	limitSchema,
	pageSchema,
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

export const UserIdParamSchema = buildObjectIdParamSchema("id");

export type UserIdParam = z.infer<typeof UserIdParamSchema>;

export const BlockUserBodySchema = z
	.object({
		reportId: z.string().optional(),
		reason: z.string().optional(),
	})
	.default({});

export type BlockUserBody = z.infer<typeof BlockUserBodySchema>;
