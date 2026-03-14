import type { Response } from "express";
import { inject, injectable } from "inversify";
import type {
	IGetMeUseCase,
	IVerifyOtpUseCase,
} from "../../../application/authentication/use-cases";
import type {
	IChangePasswordUseCase,
	IGetProfileUseCase,
	IRequestChangePasswordUseCase,
	IUpdateProfileUseCase,
} from "../../../application/profile-management/use-cases";
import type { IUserRepository } from "../../../domain/repositories";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { AuthResponseMessages, ProfileResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class ProfileController {
	constructor(
		@inject(TYPES.UseCases.GetProfile)
		private readonly _getProfileUseCase: IGetProfileUseCase,
		@inject(TYPES.UseCases.UpdateProfile)
		private readonly _updateProfileUseCase: IUpdateProfileUseCase,
		@inject(TYPES.UseCases.ChangePassword)
		private readonly _changePasswordUseCase: IChangePasswordUseCase,
		@inject(TYPES.UseCases.GetMe)
		private readonly _getMeUseCase: IGetMeUseCase,
		@inject(TYPES.UseCases.RequestChangePassword)
		private readonly _requestChangePasswordUseCase: IRequestChangePasswordUseCase,
		@inject(TYPES.UseCases.VerifyOtp)
		private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
	) {}

	getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const userId = req.user.id;
		const data = await this._getMeUseCase.execute({ userId });

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.FETCH_USER_SUCCESS,
			data,
		});
	});

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

	requestChangePassword = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const userId = req.user.id;

			await this._requestChangePasswordUseCase.execute({
				...req.body,
				userId,
			});

			return sendSuccess(res, HttpStatus.OK, {
				message: AuthResponseMessages.OTP_SENT,
			});
		},
	);

	verifyChangePasswordOtp = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { otp } = req.body;
			const userId = req.user.id;

			const user = await this._userRepository.findById(userId);
			if (!user) {
				throw new Error("User not found");
			}

			const result = await this._verifyOtpUseCase.execute({
				email: user.email,
				otp,
				type: "CHANGE_PASSWORD",
			});

			return sendSuccess(res, HttpStatus.OK, {
				message: AuthResponseMessages.OTP_VERIFIED,
				data: result,
			});
		},
	);

	changePassword = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const userId = req.user.id;

			await this._changePasswordUseCase.execute({
				...req.body,
				userId,
			});

			return sendSuccess(res, HttpStatus.OK, {
				message: ProfileResponseMessages.CHANGE_PASSWORD_SUCCESS,
			});
		},
	);
}
