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

export const availabilityIdParamSchema = {
	params: z.object({
		id: objectIdSchema,
	}),
};

export const createAvailabilitySchema = {
	body: z.object({
		name: z.string().min(1, "Name is required"),
		description: z.string().default(""),
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
		endDate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format"),
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
		bufferTime: z.number().int().min(0).default(0),
		priority: z.number().int().min(0).default(0),
	}),
};

export const updateAvailabilitySchema = {
	params: z.object({
		id: objectIdSchema,
	}),
	body: createAvailabilitySchema.body.partial(),
};

export const getMentorAvailabilitiesSchema = {
	query: z.object({
		expired: z
			.enum(["true", "false"])
			.optional()
			.transform((val) => val === "true"),
	}),
};
