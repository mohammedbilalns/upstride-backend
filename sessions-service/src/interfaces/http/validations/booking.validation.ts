import z from "zod";

// book session
export const bookSessionValidationParamsSchema = z.object({
	slotId: z.string(),
});

export const bookSessionValidationPayloadSchema = z.object({});

// cancel booking
export const cancelBookingValidationParamsSchema = z.object({
	slotId: z.string(),
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
