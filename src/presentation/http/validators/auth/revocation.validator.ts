import { z } from "zod";

export const RevokeSessionBodySchema = z.object({
	targetSessionId: z.string().trim().min(1),
});

export type RevokeSessionBody = z.infer<typeof RevokeSessionBodySchema>;
