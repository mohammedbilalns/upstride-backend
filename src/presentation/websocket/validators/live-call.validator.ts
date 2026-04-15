import z from "zod";
import { objectIdSchema } from "../../../shared/validators";

const bookingIdSchema = z.string().uuid("Invalid bookingId");

export const JoinCallPayloadSchema = z.object({
	bookingId: bookingIdSchema,
});

export const LeaveCallPayloadSchema = z.object({
	bookingId: bookingIdSchema,
});

export const ToggledMediaPayloadSchema = z.object({
	bookingId: bookingIdSchema,
	mediaType: z.string().trim().min(1),
	isEnabled: z.boolean(),
});

export const WhiteBoardPermissionSchema = z.object({
	bookingId: bookingIdSchema,
	menteeId: objectIdSchema,
	allow: z.boolean(),
});

export const TerminateSessionPayloadSchema = z.object({
	bookingId: bookingIdSchema,
});
