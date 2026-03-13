import z from "zod";

export const googleLoginBodySchema = z.object({
	accessToken: z.string().trim().min(1),
});

export const linkedinLoginBodySchema = z.object({
	code: z.string().trim().min(1),
	redirectUri: z.string().trim().min(1),
});

export type GoogleLoginBody = z.infer<typeof googleLoginBodySchema>;
export type LinkedInLoginBody = z.infer<typeof linkedinLoginBodySchema>;
