import { inject, injectable } from "inversify";
import type {
	IAddInterestUseCase,
	IAddProfessionUseCase,
	IAddSkillUseCase,
	IDisableInterestUseCase,
	IDisableProfessionUseCase,
	IDisableSkillUseCase,
	IEnableInterestUseCase,
	IEnableProfessionUseCase,
	IEnableSkillUseCase,
	IFetchCatalogUseCase,
	IGetOnboardingCatalogUseCase,
	IGetProfessionsUseCase,
} from "../../../application/catalog-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { CatalogResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class CatalogController {
	constructor(
		@inject(TYPES.UseCases.GetOnboardingCatalog)
		private _getOnboardingCatalogUseCase: IGetOnboardingCatalogUseCase,
		@inject(TYPES.UseCases.GetProfessions)
		private _getProfessionsUseCase: IGetProfessionsUseCase,
		@inject(TYPES.UseCases.FetchCatalog)
		private _fetchCatalogUseCase: IFetchCatalogUseCase,
		@inject(TYPES.UseCases.AddInterest)
		private _addInterestUseCase: IAddInterestUseCase,
		@inject(TYPES.UseCases.DisableInterest)
		private _disableInterestUseCase: IDisableInterestUseCase,
		@inject(TYPES.UseCases.AddSkill)
		private _addSkillUseCase: IAddSkillUseCase,
		@inject(TYPES.UseCases.DisableSkill)
		private _disableSkillUseCase: IDisableSkillUseCase,
		@inject(TYPES.UseCases.AddProfession)
		private _addProfessionUseCase: IAddProfessionUseCase,
		@inject(TYPES.UseCases.DisableProfession)
		private _disableProfessionUseCase: IDisableProfessionUseCase,
		@inject(TYPES.UseCases.EnableInterest)
		private _enableInterestUseCase: IEnableInterestUseCase,
		@inject(TYPES.UseCases.EnableSkill)
		private _enableSkillUseCase: IEnableSkillUseCase,
		@inject(TYPES.UseCases.EnableProfession)
		private _enableProfessionUseCase: IEnableProfessionUseCase,
	) {}

	fetchCatalog = asyncHandler(async (_req, res) => {
		const data = await this._fetchCatalogUseCase.execute();

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.CATALOG_FETCHED_SUCCESS,
			data,
		});
	});

	getOnboardingCatalog = asyncHandler(async (_req, res) => {
		const data = await this._getOnboardingCatalogUseCase.execute();

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.CATALOG_FETCHED_SUCCESS,
			data,
		});
	});

	getProfessions = asyncHandler(async (_req, res) => {
		const data = await this._getProfessionsUseCase.execute();

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.CATALOG_FETCHED_SUCCESS,
			data,
		});
	});

	addInterest = asyncHandler(async (req, res) => {
		await this._addInterestUseCase.execute(req.body);

		sendSuccess(res, HttpStatus.CREATED, {
			message: CatalogResponseMessages.INTEREST_ADDED_SUCCESS,
		});
	});

	disableInterest = asyncHandler(async (req, res) => {
		await this._disableInterestUseCase.execute({
			interestId: req.params.id as string,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.INTEREST_DISABLED_SUCCESS,
		});
	});

	addSkill = asyncHandler(async (req, res) => {
		await this._addSkillUseCase.execute(req.body);

		sendSuccess(res, HttpStatus.CREATED, {
			message: CatalogResponseMessages.SKILL_ADDED_SUCCESS,
		});
	});

	disableSkill = asyncHandler(async (req, res) => {
		await this._disableSkillUseCase.execute({
			skillId: req.params.id as string,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.SKILL_DISABLED_SUCCESS,
		});
	});

	addProfession = asyncHandler(async (req, res) => {
		await this._addProfessionUseCase.execute(req.body);

		sendSuccess(res, HttpStatus.CREATED, {
			message: CatalogResponseMessages.PROFESSION_ADDED_SUCCESS,
		});
	});

	disableProfession = asyncHandler(async (req, res) => {
		await this._disableProfessionUseCase.execute({
			professionId: req.params.id as string,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.PROFESSION_DISABLED_SUCCESS,
		});
	});

	enableInterest = asyncHandler(async (req, res) => {
		await this._enableInterestUseCase.execute({
			interestId: req.params.id as string,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.INTEREST_ENABLED_SUCCESS,
		});
	});

	enableSkill = asyncHandler(async (req, res) => {
		await this._enableSkillUseCase.execute({
			skillId: req.params.id as string,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.SKILL_ENABLED_SUCCESS,
		});
	});

	enableProfession = asyncHandler(async (req, res) => {
		await this._enableProfessionUseCase.execute({
			professionId: req.params.id as string,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.PROFESSION_ENABLED_SUCCESS,
		});
	});
}
