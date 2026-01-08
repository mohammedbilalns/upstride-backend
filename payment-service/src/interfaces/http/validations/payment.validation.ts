import { z } from "zod";

export const createPaymentSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	mentorId: z.string().min(1, "Mentor ID is required"),
	sessionId: z.string().optional(),
	amount: z.number().min(0.01, "Amount must be greater than 0"),
	currency: z.string().default("USD").optional(),
});

export const capturePaymentSchema = z
	.object({
		paymentId: z.string().min(1, "Payment ID is required").optional(),
		transactionId: z.string().min(1, "Transaction ID is required").optional(),
	})
	.refine((data) => data.paymentId || data.transactionId, {
		message: "Either Payment ID or Transaction ID is required",
		path: ["paymentId"],
	});

export const getUserPaymentsSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
});

export const getMentorPaymentsSchema = z.object({
	mentorId: z.string().min(1, "Mentor ID is required"),
});
