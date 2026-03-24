import mongoose from "mongoose";
import { z } from "zod";

export const percentageSchema = z
	.number()
	.min(0, "Percentage must be at least 0")
	.max(100, "Percentage must be at most 100");

export const nonNegativeIntSchema = z
	.number()
	.int()
	.min(0, "Value must be at least 0");

export const positiveIntSchema = z
	.number()
	.int()
	.positive("Value must be greater than 0");

export const objectIdSchema = z
	.string()
	.refine((val) => mongoose.Types.ObjectId.isValid(val), {
		message: "Invalid Id",
	});

export const pageSchema = z.coerce.number().int().positive().default(1);
export const limitSchema = z.coerce
	.number()
	.int()
	.refine((val: number) => [10, 20, 50].includes(val), {
		message: "Limit must be 10, 20, or 50",
	})
	.default(10);

export const otpSchema = z.string().min(6, "OTP must be at least 6 characters");

export const useridSchema = z.string().min(1, "User ID is required");

export const dateSchema = (message: string = "Invalid date") =>
	z.coerce.date(message);

export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.max(128, "Password must be at most 128 characters long")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(
		/[^a-zA-Z0-9]/,
		"Password must contain at least one special character (e.g. @, !, #)",
	);

export const phoneSchema = z
	.string()
	.trim()
	.regex(/^\+[1-9]\d{1,14}$/, {
		message: "Phone number must be in valid E.164 format (e.g., +919876543210)",
	});
