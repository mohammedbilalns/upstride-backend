import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type { IExpertiseService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import {
	createExpertiseSchema,
	createSkillParamsSchema,
	createSkillSchema,
	fetchExpertisesSchema,
	fetchSkillSchema,
	fetchSkillSFromMultipleExpertiseSchema,
	fetchSkillsParamsSchema,
	updateExpertiseParamsSchema,
	updateExpertiseSchema,
	updateSkillparamsSchema,
	updateSkillSchema,
	verifyExpertiseParamsSchema,
	verifySkillParamsSchema,
} from "../validations/expertise.validation";

export class ExpertiseController {
	constructor(private _expertiseService: IExpertiseService) {}

	createExpertise = asyncHandler(async (req, res) => {
		const data = createExpertiseSchema.parse(req.body);
		await this._expertiseService.createExpertise(data);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.EXPERTISE_CREATED });
	});

	udpateExpertise = asyncHandler(async (req, res) => {
		const { expertiseId } = updateExpertiseParamsSchema.parse(req.params);
		const data = updateExpertiseSchema.parse(req.body);
		await this._expertiseService.updateExpertise({ expertiseId, ...data });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.EXPERTISE_UPDATED });
	});

	fetchExpertises = asyncHandler(async (req, res) => {
		const filterData = fetchExpertisesSchema.parse(req.query);
		const userRole = res.locals.user?.role;
		const { data, total } = await this._expertiseService.fetchExpertises({
			...filterData,
			userRole,
		});
		res.status(HttpStatus.OK).json({ expertises: data, total });
	});

	verifyExpertise = asyncHandler(async (req, res) => {
		const { expertiseId } = verifyExpertiseParamsSchema.parse(req.params);
		await this._expertiseService.verifyExpertise(expertiseId);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.EXPERTISE_VERIFIED });
	});

	createSkill = asyncHandler(async (req, res) => {
		const { expertiseId } = createSkillParamsSchema.parse(req.params);
		const { name } = createSkillSchema.parse(req.body);
    console.log("user role", res.locals.user.role);
		await this._expertiseService.createSkill({
			expertiseId,
			name,
			userRole: res.locals.user.role,
		});
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SKILL_CREATED });
	});

	updateSkill = asyncHandler(async (req, res) => {
		const { skillId } = updateSkillparamsSchema.parse(req.params);
		const data = updateSkillSchema.parse(req.body);
		await this._expertiseService.updateSkill({ skillId, ...data });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SKILL_UPDATED });
	});

	verifySkill = asyncHandler(async (req, res) => {
		const { skillId } = verifySkillParamsSchema.parse(req.params);
		await this._expertiseService.updateSkill({ skillId, isVerified: true });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SKILL_VERIFIED });
	});

	fetchSkills = asyncHandler(async (req, res) => {
		const data = fetchSkillSchema.parse(req.query);
		const { expertiseId } = fetchSkillsParamsSchema.parse(req.params);
		const { expertises, total } = await this._expertiseService.fetchSkills({
			...data,
			expertiseId,
			userRole: res.locals?.user?.role,
		});

		res.status(HttpStatus.OK).json({ data: expertises, total });
	});

	fetchSkillsFromMultipleExpertise = asyncHandler(async (req, res) => {
		const data = fetchSkillSFromMultipleExpertiseSchema.parse(req.body);
		const skills =
			await this._expertiseService.fetchSkillsFromMulipleExpertise(data);
		return res.status(HttpStatus.OK).json({ data: skills });
	});

	fetchActiveExpertisesAndSkills = asyncHandler(async (_req, res) => {
		const data = await this._expertiseService.findActiveExpertisesAndSkills();
		return res.status(HttpStatus.OK).send(data);
	});
}
