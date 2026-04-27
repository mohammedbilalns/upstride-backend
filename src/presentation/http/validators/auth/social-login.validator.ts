import z from "zod";

export const GoogleLoginBodySchema = z.object({
	code: z.string().trim().min(1),
});

export const LinkedInLoginBodySchema = z.object({
	code: z.string().trim().min(1),
	redirectUri: z.string().trim().min(1),
});

export type GoogleLoginBody = z.infer<typeof GoogleLoginBodySchema>;
export type LinkedInLoginBody = z.infer<typeof LinkedInLoginBodySchema>;
