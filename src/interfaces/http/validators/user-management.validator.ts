import { z } from "zod";
import { UserRoleValues } from "../../../domain/entities/user.entity";

export const UsersQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce
		.number()
		.int()
		.refine((val: number) => [10, 20, 50].includes(val), {
			message: "Limit must be 10, 20, or 50",
		})
		.default(10),
	search: z.string().optional(),
	role: z.enum(UserRoleValues).optional(),
	status: z.enum(["active", "blocked"]).optional(),
	sort: z.enum(["recent", "old"]).default("recent"),
});
