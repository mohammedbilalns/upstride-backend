import z from "zod";
import { objectIdSchema } from "../../../shared/validators";

const bookingIdSchema = z.string().min(1);

const rtcSessionDescriptionSchema = z.object({
	type: z.enum(["offer", "pranswer", "answer", "rollback"]),
	sdp: z.string().nullable().optional(),
});

const rtcIceCandidateSchema = z.object({
	candidate: z.string(),
	sdpMid: z.string().nullable().optional(),
	sdpMLineIndex: z.number().int().nullable().optional(),
	usernameFragment: z.string().nullable().optional(),
});

const whiteboardElementStateSchema = z.record(z.string(), z.unknown());

export const JoinCallPayloadSchema = z.object({
	bookingId: bookingIdSchema,
});

export const LeaveCallPayloadSchema = z.object({
	bookingId: bookingIdSchema,
});

export const ToggledMediaPayloadSchema = z.object({
	bookingId: bookingIdSchema,
	mediaType: z.enum(["camera", "mic", "screen"]),
	isEnabled: z.boolean(),
});

export const WebRTCOfferPayloadSchema = z.object({
	bookingId: bookingIdSchema,
	offer: rtcSessionDescriptionSchema,
});

export const WebRTCAnswerPayloadSchema = z.object({
	bookingId: bookingIdSchema,
	answer: rtcSessionDescriptionSchema,
});

export const WebRTCIceCandidatePayloadSchema = z.object({
	bookingId: bookingIdSchema,
	candidate: rtcIceCandidateSchema,
});

export const WhiteboardSyncPayloadSchema = z.object({
	bookingId: bookingIdSchema,
	update: z.array(whiteboardElementStateSchema),
});

export const WhiteBoardPermissionSchema = z.object({
	bookingId: bookingIdSchema,
	menteeId: objectIdSchema,
	allow: z.boolean(),
});

export const TerminateSessionPayloadSchema = z.object({
	bookingId: bookingIdSchema,
});

export const ChatMessagePayloadSchema = z.object({
	bookingId: bookingIdSchema,
	message: z.string().min(1).max(1000),
});
