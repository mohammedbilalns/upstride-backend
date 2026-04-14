import z from "zod";
import { objectIdSchema } from "../../../shared/validators";

export const JoinCallPayloadSchema = z.object({
	bookingId: objectIdSchema,
});

export const LeaveCallPayloadSchema = z.object({
	bookingId: objectIdSchema,
});

export const ToggledMediaPayloadSchema = z.object({
	bookingId: objectIdSchema,
	mediaType: z.string().trim().min(1),
	isEnabled: z.boolean(),
});

export const WhiteBoardPermissionSchema = z.object({
	bookingId: objectIdSchema,
	menteeId: objectIdSchema,
	allow: z.boolean(),
});

export const TerminateSessionPayloadSchema = z.object({
	bookingId: objectIdSchema,
});
