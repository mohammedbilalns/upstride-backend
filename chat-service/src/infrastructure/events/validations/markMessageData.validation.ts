import z from "zod";

export const markMessageDataSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	messageId: z.string().min(1, "Message ID is required"),
});

export type MarkMessageDataPayload = z.infer<typeof markMessageDataSchema>;
