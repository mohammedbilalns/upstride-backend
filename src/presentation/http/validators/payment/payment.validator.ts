import { z } from "zod";
import { positiveIntSchema } from "../../../../shared/validators";

export const CreateCheckoutSessionBodySchema = z.object({
	coins: positiveIntSchema,
	successPath: z
		.string()
		.regex(/^\/[^\s]*$/, "Success path must be a valid relative path")
		.optional(),
	cancelPath: z
		.string()
		.regex(/^\/[^\s]*$/, "Cancel path must be a valid relative path")
		.optional(),
});
