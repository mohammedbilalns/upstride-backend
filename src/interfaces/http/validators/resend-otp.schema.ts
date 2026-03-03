import { z } from "zod";

export const resendOtpBodySchema = z.object({
	email: z.email(),
});
