import { z } from "zod";

export const getMentorSlotsQuerySchema = z.object({
    mentorId: z.string().optional(),
    availableOnly: z.enum(["true", "false"]).optional(),
    month: z.string().regex(/^\d+$/).transform(Number).optional(),
    year: z.string().regex(/^\d+$/).transform(Number).optional(),
});
