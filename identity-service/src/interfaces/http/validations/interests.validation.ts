import { z } from "zod";

export const addInterestsSchema = z.object({
	expertises: z.array(z.string()),
	skills: z.array(z.string()),
});
