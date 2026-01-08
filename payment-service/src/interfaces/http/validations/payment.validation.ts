import { z } from "zod";

export const createPaymentSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	mentorId: z.string().min(1, "Mentor ID is required"),
	bookingId: z.string().min(1, "Booking ID is required"),
	sessionId: z.string().optional(),
	amount: z.number().min(0.01, "Amount must be greater than 0"),
	currency: z.string().default("USD").optional(),
});

export const verifyPaymentSchema = z.object({
	orderId: z.string().min(1, "Order ID is required"),
	paymentId: z.string().min(1, "Payment ID is required"),
	signature: z.string().min(1, "Signature is required"),
});

export const getUserPaymentsSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
});

export const getMentorPaymentsSchema = z.object({
	mentorId: z.string().min(1, "Mentor ID is required"),
});
