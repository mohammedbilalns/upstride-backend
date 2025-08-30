import { z } from "zod";

export const createExpertiseSchema = z.object({
  name: z.string().min(3).max(50).trim(),
  description: z.string().min(3).max(200).trim(),
  skills: z.array(z.string()).min(1).max(15),
});

export const updateExpertiseParamsSchema = z.object({
  expertiseId: z.string(),
});

export const updateExpertiseSchema = z.object({
  name: z.string().min(3).max(50).trim().optional(),
  description: z.string().min(3).max(200).trim().optional(),
 
});

export const fetchExpertisesSchema = z.object({
  page: z.coerce.number().min(1).max(100).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  query: z.string().trim().optional(),
});

export const verifyExpertiseParamsSchema = z.object({
  expertiseId: z.string(),
});

export const createSkillSchema = z.object({
  name: z.string().min(3).max(50).trim(), 
});
export const createSkillParamsSchema = z.object({
  expertiseId: z.string(),
});

export const updateSkillparamsSchema = z.object({
  skillId: z.string(),
});

export const updateSkillSchema = z.object({
  name: z.string().min(3).max(50).trim().optional(),
  isVerified: z.boolean().optional(),
});

export const fetchSkillSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  query: z.string().min(3).max(50).trim().optional(),
});

export const fetchSkillsParamsSchema = z.object({
  expertiseId: z.string(),
});

export const verifySkillParamsSchema = z.object({
  skillId: z.string(),
});
