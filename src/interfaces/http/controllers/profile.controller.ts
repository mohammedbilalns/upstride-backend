import type { Response } from "express";
import { inject, injectable } from "inversify";
import type { IGetProfileUseCase } from "../../../application/profile-management/use-cases/get-profile.usecase.interface";
import type { IUpdateProfileUseCase } from "../../../application/profile-management/use-cases/update-profile.usecase.interface";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { ProfileResponseMessages } from "../constants/response-messages";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class ProfileController {
	constructor(
		@inject(TYPES.UseCases.GetProfile)
		private readonly _getProfileUseCase: IGetProfileUseCase,
		@inject(TYPES.UseCases.UpdateProfile)
		private readonly _updateProfileUseCase: IUpdateProfileUseCase,
	) {}

	getProfile = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const userId = req.user.id;
			const result = await this._getProfileUseCase.execute({ userId });

			return sendSuccess(res, HttpStatus.OK, {
				message: ProfileResponseMessages.FETCH_PROFILE_SUCCESS,
				data: result,
			});
		},
	);

	updateProfile = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const userId = req.user.id;
			const result = await this._updateProfileUseCase.execute({
				...req.body,
				userId,
			});

			return sendSuccess(res, HttpStatus.OK, {
				message: ProfileResponseMessages.UPDATE_PROFILE_SUCCESS,
				data: result,
			});
		},
	);
}
