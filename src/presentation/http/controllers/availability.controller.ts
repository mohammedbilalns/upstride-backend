import { inject, injectable } from "inversify";
import type { z } from "zod";
import type { ICreateAvailabilityUseCase } from "../../../application/modules/availability-management/use-cases/create-availability.usecase.interface";
import type { IDeleteAvailabilityUseCase } from "../../../application/modules/availability-management/use-cases/delete-availability.usecase.interface";
import type { IGetMentorAvailabilitiesUseCase } from "../../../application/modules/availability-management/use-cases/get-mentor-availabilities.usecase.interface";
import type { IReenableAvailabilityUseCase } from "../../../application/modules/availability-management/use-cases/reenable-availability.usecase.interface";
import type { IUpdateAvailabilityUseCase } from "../../../application/modules/availability-management/use-cases/update-availability.usecase.interface";

import { HttpStatus } from "../../../shared/constants/http-status-codes";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { RESPONSE_MESSAGES } from "../constants/response-messages";
import { asyncHandler, sendSuccess } from "../helpers";
import type {
	availabilityIdParamSchema,
	createAvailabilitySchema,
	getMentorAvailabilitiesSchema,
	updateAvailabilitySchema,
} from "../validators/availability.validator";

@injectable()
export class AvailabilityController {
	constructor(
		@inject(TYPES.UseCases.CreateAvailability)
		private readonly _createAvailabilityUseCase: ICreateAvailabilityUseCase,
		@inject(TYPES.UseCases.UpdateAvailability)
		private readonly _updateAvailabilityUseCase: IUpdateAvailabilityUseCase,
		@inject(TYPES.UseCases.DeleteAvailability)
		private readonly _deleteAvailabilityUseCase: IDeleteAvailabilityUseCase,
		@inject(TYPES.UseCases.GetMentorAvailabilities)
		private readonly _getMentorAvailabilitiesUseCase: IGetMentorAvailabilitiesUseCase,
		@inject(TYPES.UseCases.ReenableAvailability)
		private readonly _reenableAvailabilityUseCase: IReenableAvailabilityUseCase,
	) {}

	createAvailability = asyncHandler(async (req, res) => {
		const mentorId = (req as AuthenticatedRequest).user.id;
		const { body } = req.validated as {
			body: z.infer<typeof createAvailabilitySchema.body>;
		};

		const result = await this._createAvailabilityUseCase.execute({
			mentorId,
			...body,
		});

		return sendSuccess(res, HttpStatus.CREATED, {
			message: RESPONSE_MESSAGES.AVAILABILITY.CREATED,
			data: result.availabilityId,
		});
	});

	updateAvailability = asyncHandler(async (req, res) => {
		const mentorId = (req as AuthenticatedRequest).user.id;
		const { params, body } = req.validated as {
			params: z.infer<typeof updateAvailabilitySchema.params>;
			body: z.infer<typeof updateAvailabilitySchema.body>;
		};

		const result = await this._updateAvailabilityUseCase.execute({
			availabilityId: params.id,
			mentorId,
			...body,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.AVAILABILITY.UPDATED,
			data: result.availabilityId,
		});
	});

	deleteAvailability = asyncHandler(async (req, res) => {
		const mentorId = (req as AuthenticatedRequest).user.id;
		const { params } = req.validated as {
			params: z.infer<typeof availabilityIdParamSchema.params>;
		};

		await this._deleteAvailabilityUseCase.execute({
			availabilityId: params.id,
			mentorId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.AVAILABILITY.DELETED,
		});
	});

	reenableAvailability = asyncHandler(async (req, res) => {
		const mentorId = (req as AuthenticatedRequest).user.id;
		const { params } = req.validated as {
			params: z.infer<typeof availabilityIdParamSchema.params>;
		};

		await this._reenableAvailabilityUseCase.execute({
			availabilityId: params.id,
			mentorId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.AVAILABILITY.UPDATED,
		});
	});

	getMentorAvailabilities = asyncHandler(async (req, res) => {
		const mentorId = (req as AuthenticatedRequest).user.id;
		const { query } = req.validated as {
			query: z.infer<typeof getMentorAvailabilitiesSchema.query>;
		};

		const result = await this._getMentorAvailabilitiesUseCase.execute({
			mentorId,
			expired: query.expired,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.AVAILABILITY.RETRIEVED,
			data: result,
		});
	});
}
