import { z } from "zod";

const objectIdSchema = z
	.string()
	.regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const Day = z.enum([
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
]);

const toMinutes = (time: string) => {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
};

export const availabilityIdParamSchema = {
	params: z.object({
		id: objectIdSchema,
	}),
};

const availabilityBaseSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be at most 100 characters"),
	description: z
		.string()
		.trim()
		.min(10, "Description must be at least 10 characters")
		.max(1000, "Description must be at most 1000 characters"),
	days: z.array(Day).min(1, "At least one day is required"),
	startTime: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM format"),
	endTime: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM format"),
	startDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format"),
	endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format"),
	breakTimes: z
		.array(
			z.object({
				startTime: z
					.string()
					.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM format"),
				endTime: z
					.string()
					.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM format"),
			}),
		)
		.default([]),
	slotDuration: z.union([z.literal(30), z.literal(60)]),
	bufferTime: z.number().int().min(5).max(60).default(5),
});

const validateTimeRange = (
	value: { startTime: string; endTime: string },
	ctx: z.RefinementCtx,
) => {
	const start = toMinutes(value.startTime);
	const end = toMinutes(value.endTime);
	if (end <= start) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "End time must be after start time",
			path: ["endTime"],
		});
		return;
	}
	if (end - start < 60) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "Availability must be at least 1 hour",
			path: ["endTime"],
		});
	}
};

export const createAvailabilitySchema = {
	body: availabilityBaseSchema.superRefine(validateTimeRange),
};

export const updateAvailabilitySchema = {
	params: z.object({
		id: objectIdSchema,
	}),
	body: availabilityBaseSchema.partial().superRefine((value, ctx) => {
		if (value.startTime && value.endTime) {
			validateTimeRange(
				{ startTime: value.startTime, endTime: value.endTime },
				ctx,
			);
		}
	}),
};

export const getMentorAvailabilitiesSchema = {
	query: z.object({
		expired: z
			.enum(["true", "false"])
			.optional()
			.transform((val) => val === "true"),
		status: z.enum(["active", "disabled"]).optional(),
	}),
};
