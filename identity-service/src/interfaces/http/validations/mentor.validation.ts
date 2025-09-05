import { z } from "zod";

export const createMentorSchema = z.object({
	bio: z.string().min(10).max(500),
	currentRole: z.string(),
	institution: z.string().min(2).max(50),
	yearsOfExperience: z.number().min(1).max(100),
	educationalQualifications: z.array(z.string().min(2).max(50)),
	personalWebsite: z.string().min(2).max(50),
	resumeUrl: z.string(),
	termsAccepted: z.boolean(),
	skillIds: z.array(z.string()),
	expertiseId: z.string(),
});

export const updateMentorSchema = z.object({
	bio: z.string().min(10).max(500).optional(),
	currentRole: z.string().optional(),
	institution: z.string().min(2).max(50).optional(),
	yearsOfExperience: z.number().min(1).max(100).optional(),
	educationalQualifications: z.array(z.string().min(2).max(50)).optional(),
	personalWebsite: z.string().min(2).max(50).optional(),
	resumeUrl: z.string().optional() ,
	skillIds: z.array(z.string()).optional(),
	expertiseId: z.string().optional(),
});


export const fetchMentorsByExpertiseAndSkillSchema = z.object({
	page: z.number().min(1).max(100),
	limit: z.number().min(1).max(100),
	query: z.string().optional(),
	expertiseId: z.string(),
	skillId: z.string(),
});

export const approveMentorSchema = z.object({
	mentorId: z.string(),
});

export const rejectMentorSchema = z.object({
	mentorId: z.string(),
});

