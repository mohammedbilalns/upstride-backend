import { z } from "zod";
import {
	MAX_MENTOR_AREAS_OF_EXPERTISE,
	MAX_MENTOR_EXPERIENCE_ITEMS,
} from "../../../domain/entities/mentor.entity";
import { SkillLevelValues } from "../../../domain/entities/user.entity";

export const registerMentorSchema = z.object({
	bio: z.string().min(10, "Bio must be at least 10 characters long"),
	currentRoleId: z.string().min(1, "Current role is required"),
	organization: z.string().min(1, "Organization is required"),
	yearsOfExperience: z
		.number()
		.min(0, "Years of experience must be at least 0"),
	personalWebsite: z.string().url("Invalid website URL").or(z.literal("")),
	resumeId: z.string().min(1, "Resume is required"),
	educationalQualifications: z
		.array(z.string().min(1))
		.min(1, "At least one qualification is required"),
	areasOfExpertise: z
		.array(z.string().min(1))
		.min(1, "At least one area of expertise is required")
		.max(
			MAX_MENTOR_AREAS_OF_EXPERTISE,
			`Maximum of ${MAX_MENTOR_AREAS_OF_EXPERTISE} areas of expertise allowed`,
		),
	toolsAndSkills: z
		.array(
			z.object({
				skillId: z.string().min(1),
				level: z.enum(SkillLevelValues),
			}),
		)
		.min(1, "At least one skill is required"),
	experience: z
		.array(
			z.object({
				company: z.string().min(1, "Company name is required"),
				role: z.string().min(1, "Role is required"),
				description: z.string().min(1, "Description is required"),
				from: z.string().datetime({ message: "Invalid from date" }),
				to: z.string().datetime({ message: "Invalid to date" }).nullable(),
			}),
		)
		.min(1, "At least one experience item is required")
		.max(
			MAX_MENTOR_EXPERIENCE_ITEMS,
			`Maximum of ${MAX_MENTOR_EXPERIENCE_ITEMS} experience items allowed`,
		),
});

export const resubmitMentorSchema = z.object({
	bio: z.string().min(10, "Bio must be at least 10 characters long").optional(),
	currentRoleId: z.string().min(1, "Current role is required").optional(),
	organization: z.string().min(1, "Organization is required").optional(),
	yearsOfExperience: z
		.number()
		.min(0, "Years of experience must be at least 0")
		.optional(),
	personalWebsite: z
		.string()
		.url("Invalid website URL")
		.or(z.literal(""))
		.optional(),
	resumeId: z.string().min(1, "Resume is required").optional(),
	educationalQualifications: z
		.array(z.string().min(1))
		.min(1, "At least one qualification is required")
		.optional(),
	areasOfExpertise: z
		.array(z.string().min(1))
		.min(1, "At least one area of expertise is required")
		.max(
			MAX_MENTOR_AREAS_OF_EXPERTISE,
			`Maximum of ${MAX_MENTOR_AREAS_OF_EXPERTISE} areas of expertise allowed`,
		)
		.optional(),
	toolsAndSkills: z
		.array(
			z.object({
				skillId: z.string().min(1),
				level: z.enum(SkillLevelValues),
			}),
		)
		.min(1, "At least one skill is required")
		.optional(),
	experience: z
		.array(
			z.object({
				company: z.string().min(1, "Company name is required"),
				role: z.string().min(1, "Role is required"),
				description: z.string().min(1, "Description is required"),
				from: z.string().datetime({ message: "Invalid from date" }),
				to: z.string().datetime({ message: "Invalid to date" }).nullable(),
			}),
		)
		.min(1, "At least one experience item is required")
		.max(
			MAX_MENTOR_EXPERIENCE_ITEMS,
			`Maximum of ${MAX_MENTOR_EXPERIENCE_ITEMS} experience items allowed`,
		)
		.optional(),
});
