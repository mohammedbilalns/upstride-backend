import { z } from "zod";
import { UserPreferencesLimits } from "../../../../shared/constants/app.constants";

export const saveInterestsBodySchema = z.object({
	setupToken: z.string().min(1, "Setup token is required"),
	interests: z
		.array(z.string().min(1, "Interest name is required"))
		.min(
			UserPreferencesLimits.MIN_INTERESTS,
			`Select at least ${UserPreferencesLimits.MIN_INTERESTS} interests`,
		)
		.max(
			UserPreferencesLimits.MAX_INTERESTS,
			`Select at most ${UserPreferencesLimits.MAX_INTERESTS} interests`,
		),
	skills: z
		.array(
			z.object({
				skillId: z.string().min(1, "Skill ID is required"),
				level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
					message: "Invalid skill level",
				}),
			}),
		)
		.min(
			UserPreferencesLimits.MIN_SKILLS_PER_INTEREST,
			`Select at least ${UserPreferencesLimits.MIN_SKILLS_PER_INTEREST} skills`,
		)
		.max(
			UserPreferencesLimits.MAX_INTERESTS *
				UserPreferencesLimits.MAX_SKILLS_PER_INTEREST,
			"Too many skills selected",
		),
});

export type SaveInterestsBody = z.infer<typeof saveInterestsBodySchema>;
