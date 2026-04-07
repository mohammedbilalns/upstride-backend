import { z } from "zod";
import {
	MAX_MENTOR_AREAS_OF_EXPERTISE,
	MAX_MENTOR_EDUCATION_ITEMS,
	MAX_MENTOR_EXPERIENCE_ITEMS,
} from "../../../domain/entities/mentor.entity";
import { SkillLevelValues } from "../../../domain/entities/user.entity";
import {
	limitSchema,
	objectIdSchema,
	pageSchema,
} from "../../../shared/validators";

const skillItemSchema = z.object({
	skillId: z.string().min(1),
	level: z.enum(SkillLevelValues),
});

const experienceItemSchema = z.object({
	company: z.string().min(1, "Company name is required"),
	role: z.string().min(1, "Role is required"),
	description: z.string().min(1, "Description is required"),
	from: z.coerce.date({ message: "Invalid from date" }),
	to: z.coerce.date({ message: "Invalid to date" }).nullable(),
});

const buildExperienceSchema = () =>
	z
		.array(experienceItemSchema)
		.min(1, "At least one experience item is required")
		.max(
			MAX_MENTOR_EXPERIENCE_ITEMS,
			`Maximum of ${MAX_MENTOR_EXPERIENCE_ITEMS} experience items allowed`,
		)
		.superRefine((experience, ctx) => {
			const now = new Date();
			for (let i = 0; i < experience.length; i++) {
				const exp = experience[i];
				const fromDate = new Date(exp.from);
				if (fromDate > now) {
					ctx.issues.push({
						code: "custom",
						message: "From date cannot be in the future",
						path: [i, "from"],
						input: exp.from,
					});
				}
				if (exp.to) {
					const toDate = new Date(exp.to);
					if (toDate > now) {
						ctx.issues.push({
							code: "custom",
							message: "To date cannot be in the future",
							path: [i, "to"],
							input: exp.to,
						});
					}
					if (fromDate > toDate) {
						ctx.issues.push({
							code: "custom",
							message: "From date cannot be after To date",
							path: [i, "from"],
							input: exp.from,
						});
					}
				}
			}
		});

export const registerMentorSchema = z.object({
	bio: z.string().min(10, "Bio must be at least 10 characters long"),
	currentRoleId: z.string().min(1, "Current role is required"),
	organization: z.string().min(1, "Organization is required"),
	yearsOfExperience: z
		.number()
		.min(0, "Years of experience must be at least 0"),
	personalWebsite: z
		.string()
		.url("Invalid website URL")
		.or(z.literal(""))
		.nullish(),
	resumeId: z.string().min(1, "Resume is required"),
	educationalQualifications: z
		.array(z.string().min(1))
		.min(1, "At least one qualification is required")
		.max(
			MAX_MENTOR_EDUCATION_ITEMS,
			`Maximum of ${MAX_MENTOR_EDUCATION_ITEMS} educational qualifications allowed`,
		),
	areasOfExpertise: z
		.array(z.string().min(1))
		.min(1, "At least one area of expertise is required")
		.max(
			MAX_MENTOR_AREAS_OF_EXPERTISE,
			`Maximum of ${MAX_MENTOR_AREAS_OF_EXPERTISE} areas of expertise allowed`,
		),
	toolsAndSkills: z
		.array(skillItemSchema)
		.min(1, "At least one skill is required"),
	experience: buildExperienceSchema(),
});

export type RegisterMentorBody = z.infer<typeof registerMentorSchema>;

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
		.nullish(),
	resumeId: z.string().min(1, "Resume is required").optional(),
	educationalQualifications: z
		.array(z.string().min(1))
		.min(1, "At least one qualification is required")
		.max(
			MAX_MENTOR_EDUCATION_ITEMS,
			`Maximum of ${MAX_MENTOR_EDUCATION_ITEMS} educational qualifications allowed`,
		)
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
		.array(skillItemSchema)
		.min(1, "At least one skill is required")
		.optional(),
	experience: buildExperienceSchema().optional(),
});

export type ResubmitMentorBody = z.infer<typeof resubmitMentorSchema>;

export const MentorApplicationsQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: limitSchema,
	status: z.enum(["approved", "rejected", "pending"]).optional(),
	sort: z.enum(["recent", "old", "status"]).optional().default("recent"),
});

export type MentorApplicationsQuery = z.infer<
	typeof MentorApplicationsQuerySchema
>;

export const MentorDiscoveryQuerySchema = z
	.object({
		page: pageSchema,
		search: z.string().trim().min(1).optional(),
		category: z.string().trim().min(1).optional(),
		tierName: z.string().min(1).optional(),
		minExperience: z.coerce.number().int().min(0).optional(),
		maxExperience: z.coerce.number().int().min(0).optional(),
		sort: z.enum(["rating", "recent"]).optional().default("rating"),
	})
	.refine(
		(input) =>
			input.minExperience === undefined ||
			input.maxExperience === undefined ||
			input.minExperience <= input.maxExperience,
		{
			message: "minExperience cannot be greater than maxExperience",
			path: ["minExperience"],
		},
	);

export type MentorDiscoveryQuery = z.infer<typeof MentorDiscoveryQuerySchema>;

export const MentorIdParamSchema = z.object({
	id: objectIdSchema,
});

export type MentorIdParam = z.infer<typeof MentorIdParamSchema>;

export const rejectMentorBodySchema = z.object({
	reason: z.string().min(10, "Rejection reason must be at least 10 characters"),
});

export type RejectMentorBody = z.infer<typeof rejectMentorBodySchema>;

export const updateMentorProfileBodySchema = z.object({
	currentPricePer30Min: z.number().int().min(100).max(10000).optional(),
	bio: z.string().min(10).optional(),
	addSkills: z.array(skillItemSchema).optional(),
	addEducationalQualifications: z.array(z.string().min(1)).optional(),
});
