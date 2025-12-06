import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type {
	ICreateExpertiseUC,
	ICreateSkillUC,
	IFetchExpertisesUC,
	IFetchSkillsUC,
	IFindActiveExpertisesAndSkillsUC,
	IFetchSkillsFromMulipleExpertiseUC,
	IUpdateExpertiseUC,
	IUpdateSkillUC,
	IVerifyExpertiseUC,
} from "../../../domain/useCases/expertiseMangement";
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
	constructor(
		private _createExpertiseUC: ICreateExpertiseUC,
		private _createSkillUC: ICreateSkillUC,
		private _fetchExpertisesUC: IFetchExpertisesUC,
		private _fetchSkillsUC: IFetchSkillsUC,
		private _fetchSkillsFromMulipleExpertiseUC: IFetchSkillsFromMulipleExpertiseUC,
		private _findActiveExpertisesAndSkillsUC: IFindActiveExpertisesAndSkillsUC,
		private _updateExpertiseUC: IUpdateExpertiseUC,
		private _updateSkillUC: IUpdateSkillUC,
		private _verifyExpertiseUC: IVerifyExpertiseUC,
	) {}

	createExpertise = asyncHandler(async (req, res) => {
		const data = createExpertiseSchema.parse(req.body);
		await this._createExpertiseUC.execute(data);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.EXPERTISE_CREATED });
	});

	udpateExpertise = asyncHandler(async (req, res) => {
		const { expertiseId } = updateExpertiseParamsSchema.parse(req.params);
		const data = updateExpertiseSchema.parse(req.body);
		await this._updateExpertiseUC.execute({ expertiseId, ...data });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.EXPERTISE_UPDATED });
	});

	fetchExpertises = asyncHandler(async (req, res) => {
		const filterData = fetchExpertisesSchema.parse(req.query);
		const userRole = res.locals.user?.role;
		const { data, total } = await this._fetchExpertisesUC.execute({
			...filterData,
			userRole,
		});
		res.status(HttpStatus.OK).json({ expertises: data, total });
	});

	verifyExpertise = asyncHandler(async (req, res) => {
		const { expertiseId } = verifyExpertiseParamsSchema.parse(req.params);
		await this._verifyExpertiseUC.execute(expertiseId);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.EXPERTISE_VERIFIED });
	});

	createSkill = asyncHandler(async (req, res) => {
		const { expertiseId } = createSkillParamsSchema.parse(req.params);
		const { name } = createSkillSchema.parse(req.body);
		console.log("user role", res.locals.user.role);
		await this._createSkillUC.execute({
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
		await this._updateSkillUC.execute({ skillId, ...data });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SKILL_UPDATED });
	});

	verifySkill = asyncHandler(async (req, res) => {
		const { skillId } = verifySkillParamsSchema.parse(req.params);
		await this._updateSkillUC.execute({ skillId, isVerified: true });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SKILL_VERIFIED });
	});

	fetchSkills = asyncHandler(async (req, res) => {
		const data = fetchSkillSchema.parse(req.query);
		const { expertiseId } = fetchSkillsParamsSchema.parse(req.params);
		const { expertises, total } = await this._fetchSkillsUC.execute({
			...data,
			expertiseId,
			userRole: res.locals?.user?.role,
		});

		res.status(HttpStatus.OK).json({ data: expertises, total });
	});

	//NOTE: unused
	fetchSkillsFromMultipleExpertise = asyncHandler(async (req, res) => {
		const data = fetchSkillSFromMultipleExpertiseSchema.parse(req.body);
		const skills = await this._fetchSkillsFromMulipleExpertiseUC.execute(data);
		return res.status(HttpStatus.OK).json({ data: skills });
	});

	//NOTE: unused
	fetchActiveExpertisesAndSkills = asyncHandler(async (_req, res) => {
		const data = await this._findActiveExpertisesAndSkillsUC.execute();
		return res.status(HttpStatus.OK).send(data);
	});
}
