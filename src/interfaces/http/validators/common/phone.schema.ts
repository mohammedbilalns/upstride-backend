import { z } from "zod";

export const phoneSchema = z
	.string()
	.trim()
	.regex(/^\+[1-9]\d{1,14}$/, {
		message: "Phone number must be in valid E.164 format (e.g., +919876543210)",
	});
