import { z } from "zod";

export const addInterestsSchema = z.object({
	selectedAreas: z.array(z.string()),
	selectedTopics: z.array(z.string()),
	email: z.string(),
});
