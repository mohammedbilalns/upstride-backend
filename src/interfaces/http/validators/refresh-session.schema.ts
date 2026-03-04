import { z } from "zod";

export const refreshSessionBodySchema = z.object({
	refreshToken: z.string().min(1),
});
