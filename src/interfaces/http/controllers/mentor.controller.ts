import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { IGetMentorRegistrationInfoUseCase } from "../../../application/mentor-management/use-cases/get-mentor-registration-info.usecase.interface";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class MentorController {
	constructor(
		@inject(TYPES.UseCases.GetMentorRegistrationInfo)
		private readonly getMentorRegistrationInfoUseCase: IGetMentorRegistrationInfoUseCase,
	) {}

	getRegistrationInfo = asyncHandler(async (req: Request, res: Response) => {
		const userId = req.user!.id;
		const result = await this.getMentorRegistrationInfoUseCase.execute({
			userId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			data: result,
		});
	});
}
