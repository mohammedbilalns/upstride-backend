import { z } from "zod";

export const mentorRegistrationSchema = z.object({
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  currentRole: z.string().min(1, { message: "Current role is required" }),
  organisation: z.string().min(1, { message: "Organisation is required" }),
  yearsOfExperience: z
    .number()
    .min(0, { message: "Years of experience must be at least 0" })
    .max(100, { message: "Years of experience must be at most 100" }),
  educationalQualifications: z
    .array(z.string())
    .min(1, { message: "At least one qualification is required" }),
  personalWebsite: z
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  expertise: z.string().min(1, { message: "Please select an expertise" }),
  skills: z
    .array(z.string())
    .min(1, { message: "At least one skill is required" }),
  resume: z.object({
    public_id: z.string(),
    original_filename: z.string(),
    resource_type: z.string(),
    secure_url: z.url(),
    bytes: z.number(),
    asset_folder: z.string(),
  }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const updateMentorSchema = z.object({
  bio: z.string().min(10).max(500).optional(),
  currentRole: z.string().optional(),
  institution: z.string().min(2).max(50).optional(),
  yearsOfExperience: z.number().min(1).max(100).optional(),
  educationalQualifications: z.array(z.string().min(2).max(50)).optional(),
  personalWebsite: z.string().min(2).max(50).optional(),
  resumeUrl: z.string().optional(),
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
  rejectionReason: z.string().min(1).max(500),
});
