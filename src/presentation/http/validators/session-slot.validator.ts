import { z } from "zod";
import { objectIdSchema } from "../../../shared/validators";

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
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "Date must be in YYYY-MM-DD format",
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
		startTime: z.string().datetime({ message: "Invalid start time" }),
		endTime: z.string().datetime({ message: "Invalid end time" }),
		durationMinutes: durationSchema,
	})
	.refine((input) => new Date(input.endTime) > new Date(input.startTime), {
		message: "End time must be after start time",
		path: ["endTime"],
	});

export const generateSlotsBodySchema = z
	.object({
		mentorId: z.string().min(1, "Mentor id is required"),
		startDate: z
			.string()
			.datetime({ message: "Invalid start date" })
			.optional(),
		endDate: z.string().datetime({ message: "Invalid end date" }).optional(),
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
		startDate: z.string().datetime().optional(),
		endDate: z.string().datetime().optional(),
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
