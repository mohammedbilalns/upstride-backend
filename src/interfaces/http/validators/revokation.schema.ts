import { z } from "zod";

export const revokeSessionBodySchema = z.object({
	targetSessionId: z.string().trim().min(1),
});
