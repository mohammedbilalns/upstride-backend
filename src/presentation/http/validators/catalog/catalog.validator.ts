import z from "zod";
import {
	buildObjectIdParamSchema,
	nameSchema,
} from "../../../../shared/validators";

export const AddInterestBodySchema = z.object({
	name: nameSchema,
});

export type AddInterestBody = z.infer<typeof AddInterestBodySchema>;

export const AddSkillBodySchema = z.object({
	name: nameSchema,
	interestId: z.string("Invalid interest ID"),
});

export type AddSkillBody = z.infer<typeof AddSkillBodySchema>;

export const AddProfessionBodySchema = z.object({
	name: nameSchema,
});

export type AddProfessionBody = z.infer<typeof AddProfessionBodySchema>;

export const updateInterestBodySchema = z.object({
	name: nameSchema,
});

export type UpdateInterestBody = z.infer<typeof updateInterestBodySchema>;

export const updateProfessionBodySchema = z.object({
	name: nameSchema,
});

export type UpdateProfessionBody = z.infer<typeof updateProfessionBodySchema>;

export const updateSkillBodySchema = z.object({
	name: nameSchema,
});

export type UpdateSkillBody = z.infer<typeof updateSkillBodySchema>;

export const updateCatalogParamsSchema = buildObjectIdParamSchema("id");
export type UpdateCatalogParams = z.infer<typeof updateCatalogParamsSchema>;
