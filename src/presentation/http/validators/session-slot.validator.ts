import { z } from "zod";
import { dateSchema, objectIdSchema } from "../../../shared/validators";

const durationSchema = z.union([z.literal(30), z.literal(60)]);

export const slotIdParamSchema = z.object({
	slotId: z.string().min(1, "Slot id is required"),
});

export const mentorIdParamSchema = z.object({
	mentorId: objectIdSchema,
});

const availableSlotsDateSchema = z.string().transform((value, ctx) => {
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return value;
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		ctx.issues.push({
			code: "custom",
			message: "Date must be in YYYY-MM-DD format",
			input: value,
		});
		return z.NEVER;
	}

	const yyyy = parsed.getUTCFullYear();
	const mm = String(parsed.getUTCMonth() + 1).padStart(2, "0");
	const dd = String(parsed.getUTCDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
});

export const availableSlotsQuerySchema = z.object({
	date: availableSlotsDateSchema,
});

export const createCustomSlotBodySchema = z
	.object({
		startTime: dateSchema("Invalid Start time"),
		endTime: dateSchema("Invalid End time"),
		durationMinutes: durationSchema,
	})
	.refine((input) => new Date(input.endTime) > new Date(input.startTime), {
		message: "End time must be after start time",
		path: ["endTime"],
	});

export const generateSlotsBodySchema = z
	.object({
		mentorId: z.string().min(1, "Mentor id is required"),
		startDate: z.coerce.date({ message: "Invalid start date" }).optional(),
		endDate: z.coerce.date({ message: "Invalid end date" }).optional(),
	})
	.refine(
		(input) =>
			(input.startDate && input.endDate) ||
			(!input.startDate && !input.endDate),
		{
			message: "startDate and endDate must be provided together",
			path: ["startDate"],
		},
	)
	.refine(
		(input) =>
			!input.startDate ||
			!input.endDate ||
			new Date(input.endDate) >= new Date(input.startDate),
		{
			message: "End date must be after start date",
			path: ["endDate"],
		},
	);

export const getMentorSlotsQuerySchema = z
	.object({
		startDate: z.coerce.date().optional(),
		endDate: z.coerce.date().optional(),
	})
	.refine(
		(input) =>
			(input.startDate && input.endDate) ||
			(!input.startDate && !input.endDate),
		{
			message: "startDate and endDate must be provided together",
			path: ["startDate"],
		},
	);
