import { z } from "zod";

export const ResendOtpBodySchema = z.object({
	email: z.email(),
});

export type ResendOtpBody = z.infer<typeof ResendOtpBodySchema>;
