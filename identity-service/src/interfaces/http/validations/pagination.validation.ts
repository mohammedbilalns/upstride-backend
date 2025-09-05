import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Page must be a non-negative number",
    })
    .optional()
    .default(0)
    .transform((val) => Number(val)),

  limit: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Limit must be a positive number",
    })
    .optional()
    .default(10)
    .transform((val) => Number(val)),

  query: z.string().optional(),
});

