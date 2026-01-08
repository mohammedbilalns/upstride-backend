import z from "zod";

// book session
export const bookSessionValidationParamsSchema = z.object({
	slotId: z.string(),
});

export const bookSessionValidationPayloadSchema = z.object({});

// cancel booking
export const cancelBookingValidationParamsSchema = z.object({
	bookingId: z.string(),
});

export const cancelBookingValidationPayloadSchema = z.object({});

// initiate session
export const initiateSessionParamsSchema = z.object({
	sessionId: z.string(),
});

export const initiateSessionPayloadSchema = z.object({});

// mark session as complete
export const markSessionAsCompleteParamsSchema = z.object({
	sessionId: z.string(),
});

export const markSessionAsCompletePayloadSchema = z.object({});

export const requestRescheduleParamsSchema = z.object({
	bookingId: z.string(),
});

export const requestReschedulePayloadSchema = z.object({
	requestedSlotId: z.string().min(1, "Requested Slot ID is required"),
	reason: z.string().optional(),
});

export const handleRescheduleParamsSchema = z.object({
	bookingId: z.string(),
});

export const handleReschedulePayloadSchema = z.object({
	action: z.enum(["APPROVED", "REJECTED"]),
});
