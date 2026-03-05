import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { IGetMentorRegistrationInfoUseCase } from "../../../application/mentor-management/use-cases/get-mentor-registration-info.usecase.interface";
import type { IRegisterMentorUseCase } from "../../../application/mentor-management/use-cases/register-mentor.usecase.interface";
import type { IResubmitMentorUseCase } from "../../../application/mentor-management/use-cases/resubmit-mentor.usecase.interface";
import { MentorResponseMessages } from "../../../interfaces/http/constants/response-messages";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class MentorController {
	constructor(
		@inject(TYPES.UseCases.GetMentorRegistrationInfo)
		private readonly getMentorRegistrationInfoUseCase: IGetMentorRegistrationInfoUseCase,
		@inject(TYPES.UseCases.RegisterMentor)
		private readonly registerMentorUseCase: IRegisterMentorUseCase,
		@inject(TYPES.UseCases.ResubmitMentor)
		private readonly resubmitMentorUseCase: IResubmitMentorUseCase,
	) {}

	getRegistrationInfo = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const userId = req.user.id;
			const result = await this.getMentorRegistrationInfoUseCase.execute({
				userId,
			});

			return sendSuccess(res, HttpStatus.OK, {
				message: MentorResponseMessages.FETCH_REGISTRATION_INFO_SUCCESS,
				data: result,
			});
		},
	);

	register = asyncHandler(async (req: Request, res: Response) => {
		const userId = req.user!.id;
		await this.registerMentorUseCase.execute({
			...req.body,
			userId,
		});

		return sendSuccess(res, HttpStatus.CREATED, {
			message: MentorResponseMessages.REGISTRATION_SUBMITTED_SUCCESS,
		});
	});

	resubmit = asyncHandler(async (req: Request, res: Response) => {
		const userId = req.user!.id;
		await this.resubmitMentorUseCase.execute({
			...req.body,
			userId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.REGISTRATION_RESUBMITTED_SUCCESS,
		});
	});
}
