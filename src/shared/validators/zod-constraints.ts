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
