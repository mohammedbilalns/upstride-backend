import { inject, injectable } from "inversify";
import type {
	IFetchPlatformSettingsUseCase,
	IUpdateContentSettingsUseCase,
	IUpdateEconomySettingsUseCase,
	IUpdateMentorSettingsUseCase,
	IUpdateSessionSettingsUseCase,
} from "../../../application/modules/platform-settings/use-cases";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { PlatformSettingsResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";
import type {
	UpdateContentSettingsBody,
	UpdateEconomySettingsBody,
	UpdateMentorSettingsBody,
	UpdateSessionSettingsBody,
} from "../validators/platform-settings/platform-settings.validator";

@injectable()
export class PlatformSettingsController {
	constructor(
		@inject(TYPES.UseCases.FetchPlatformSettings)
		private _fetchPlatformSettingsUseCase: IFetchPlatformSettingsUseCase,
		@inject(TYPES.UseCases.UpdateEconomySettings)
		private _updateEconomySettingsUseCase: IUpdateEconomySettingsUseCase,
		@inject(TYPES.UseCases.UpdateMentorSettings)
		private _updateMentorSettingsUseCase: IUpdateMentorSettingsUseCase,
		@inject(TYPES.UseCases.UpdateContentSettings)
		private _updateContentSettingsUseCase: IUpdateContentSettingsUseCase,
		@inject(TYPES.UseCases.UpdateSessionSettings)
		private _updateSessionSettingsUseCase: IUpdateSessionSettingsUseCase,
	) {}

	fetchAll = asyncHandler(async (_req, res) => {
		const data = await this._fetchPlatformSettingsUseCase.execute();

		sendSuccess(res, HttpStatus.OK, {
			message: PlatformSettingsResponseMessages.SETTINGS_FETCHED_SUCCESS,
			data,
		});
	});

	updateEconomy = asyncHandler(async (req, res) => {
		const data = await this._updateEconomySettingsUseCase.execute(
			req.validated?.body as UpdateEconomySettingsBody,
		);

		sendSuccess(res, HttpStatus.OK, {
			message: PlatformSettingsResponseMessages.ECONOMY_UPDATED_SUCCESS,
			data,
		});
	});

	updateMentors = asyncHandler(async (req, res) => {
		const data = await this._updateMentorSettingsUseCase.execute(
			req.validated?.body as UpdateMentorSettingsBody,
		);

		sendSuccess(res, HttpStatus.OK, {
			message: PlatformSettingsResponseMessages.MENTORS_UPDATED_SUCCESS,
			data,
		});
	});

	updateContent = asyncHandler(async (req, res) => {
		const data = await this._updateContentSettingsUseCase.execute(
			req.validated?.body as UpdateContentSettingsBody,
		);

		sendSuccess(res, HttpStatus.OK, {
			message: PlatformSettingsResponseMessages.CONTENT_UPDATED_SUCCESS,
			data,
		});
	});

	updateSessions = asyncHandler(async (req, res) => {
		const data = await this._updateSessionSettingsUseCase.execute(
			req.validated?.body as UpdateSessionSettingsBody,
		);

		sendSuccess(res, HttpStatus.OK, {
			message: PlatformSettingsResponseMessages.SESSIONS_UPDATED_SUCCESS,
			data,
		});
	});
}
