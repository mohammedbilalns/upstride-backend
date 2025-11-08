import { z } from "zod";

export const fetchByUserIdsParamsSchema = z.object({
	ids: z
		.union([z.string().min(1), z.array(z.string().min(1))])
		.transform((val) => (Array.isArray(val) ? val : [val])),
});
