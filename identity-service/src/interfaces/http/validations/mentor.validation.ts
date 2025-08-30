import { z } from "zod";

export const createMentorSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters").max(1000),
  currentRole: z.string().min(2, "Current role is required").max(100),
  institution: z.string().min(2, "Institution is required").max(200),
  yearsofExperience: z
    .number()
    .min(0, "Years of experience must be non-negative"),
  educationalQualifications: z
    .array(z.string().min(2).max(100))
    .min(1, "At least one qualification is required"),
  personalWebsite: z.url("Must be a valid URL").optional(),
  expertiseId: z.string().min(1, "Expertise is required"),
  skillIds: z.array(z.string().min(1)).min(1, "At least one skill is required"),
  resumeUrl: z.url("Must be a valid URL").optional(),
  termsAccepted: z.boolean(),
});

export const updateMentorStatusSchema = z
  .object({
    mentorId: z.string().min(1, "mentorId is required"),
    isAccepted: z.boolean().optional(),
    isRejected: z.boolean().optional(),
  })
  .refine(
    (data) => data.isAccepted !== undefined || data.isRejected !== undefined,
    {
      message: "Either isAccepted or isRejected must be provided",
    },
  );

export const fetchMentorsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  query: z.string().min(3).max(50).trim().optional(),
  expertiseId: z.string().min(1, "expertiseId is required"),
  skillIds: z.array(z.string()).optional(),
});
