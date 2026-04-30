import z from "zod";

export const FeedBackBodySchema = z.object({
	bookingId: z.string().min(1, "Booking id is required"),
	feedback: z
		.string()
		.min(10, "Feedback must be atleast 10 characters")
		.max(1000, "Feedback must be less than 1000 characters"),
});

export type FeedBackBody = z.infer<typeof FeedBackBodySchema>;
