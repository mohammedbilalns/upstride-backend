import { z } from "zod";
import { positiveIntSchema } from "../../../../shared/validators";

export const createCheckoutSessionBodySchema = z.object({
	coins: positiveIntSchema,
});
