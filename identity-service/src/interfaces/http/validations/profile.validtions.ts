import z from "zod";

export const changePasswordSchema = z.object({
	oldPassword: z.string().min(8).max(100).trim(),
	newPassword: z.string().min(8).max(100).trim(),
});

export const fetchProfileSchema = z.object({
	profileId: z.string(),
});

export const updateProfileSchema = z.object({
	id: z.string(),
	name: z.string().min(2).max(100).trim().optional(),
	phone: z.string().length(10).trim().optional(),
	profilePicture: z
		.object({
			public_id: z.string(),
			original_filename: z.string(),
			resource_type: z.string(),
			secure_url: z.url(),
			bytes: z.number(),
			asset_folder: z.string(),
		})
		.optional(),
	interestedExpertises: z.array(z.string().min(2).max(100).trim()).optional(),
	interestedSkills: z.array(z.string().min(2).max(100).trim()).optional(),
});
