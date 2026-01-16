import { z } from "zod";

export const createPaymentSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	mentorId: z.string().optional(),
	bookingId: z.string().optional(),
	paymentType: z.enum(["BOOKING", "WALLET_LOAD"]).optional().default("BOOKING"),
	sessionId: z.string().optional(),
	amount: z.number().min(0.01, "Amount must be greater than 0"),
	currency: z.string().default("INR").optional(),
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

export const payWithWalletSchema = z.object({
	slotId: z.string().min(1, "Slot ID is required"),
	mentorId: z.string().min(1, "Mentor ID is required"),
	bookingId: z.string().min(1, "Booking ID is required"),
	amount: z.number().min(0.01, "Amount must be greater than 0"),
});
