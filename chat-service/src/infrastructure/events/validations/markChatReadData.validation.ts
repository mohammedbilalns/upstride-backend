import { z } from "zod";

export const markChatReadDataSchema = z.object({
	userId: z.string(),
	senderId: z.string(),
});

export type MarkChatReadDataPayload = z.infer<typeof markChatReadDataSchema>;
