import z from "zod";
import { buildObjectIdParamSchema } from "../../../../shared/validators";

const CatalogNameSchema = z
	.string()
	.trim()
	.min(2, "Name must be at least 2 characters")
	.max(50, "Name must be at most 50 characters");

export const AddInterestBodySchema = z.object({
	name: CatalogNameSchema,
});

export type AddInterestBody = z.infer<typeof AddInterestBodySchema>;

export const AddSkillBodySchema = z.object({
	name: CatalogNameSchema,
	interestId: z.string("Invalid interest ID"),
});

export type AddSkillBody = z.infer<typeof AddSkillBodySchema>;

export const AddProfessionBodySchema = z.object({
	name: CatalogNameSchema,
});

export type AddProfessionBody = z.infer<typeof AddProfessionBodySchema>;

export const updateInterestBodySchema = z.object({
	name: CatalogNameSchema,
});

export type UpdateInterestBody = z.infer<typeof updateInterestBodySchema>;

export const updateProfessionBodySchema = z.object({
	name: CatalogNameSchema,
});

export type UpdateProfessionBody = z.infer<typeof updateProfessionBodySchema>;

export const updateSkillBodySchema = z.object({
	name: CatalogNameSchema,
});

export type UpdateSkillBody = z.infer<typeof updateSkillBodySchema>;

export const updateCatalogParamsSchema = buildObjectIdParamSchema("id");
export type UpdateCatalogParams = z.infer<typeof updateCatalogParamsSchema>;
