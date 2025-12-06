import { z } from "zod";

export const addInterestsSchema = z.object({
	selectedAreas: z.array(z.string()),
	selectedTopics: z.array(z.string()),
	newExpertises: z.array(z.string()).optional(),
	newTopics: z
		.array(
			z
				.object({
					expertiseId: z.string().optional(),
					expertiseName: z.string().optional(),
					name: z.string(),
				})
				.superRefine((data, ctx) => {
					const hasId = !!data.expertiseId;
					const hasName = !!data.expertiseName;

					// neither provided
					if (!hasId && !hasName) {
						ctx.addIssue(
							"Either expertiseId or expertiseName must be provided",
						);
					}

					// both provided
					if (hasId && hasName) {
						ctx.addIssue(
							"Provide only one of expertiseId or expertiseName, not both",
						);
					}
				}),
		)
		.optional(),
	email: z.string(),
});
