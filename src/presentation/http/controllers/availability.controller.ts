import { inject, injectable } from "inversify";
import type { z } from "zod";
import type { ICheckAndCreateAvailabilityUseCase } from "../../../application/modules/availability-management/use-cases/check-and-create-availability.usecase.interface";
import type { ICreateAvailabilityUseCase } from "../../../application/modules/availability-management/use-cases/create-availability.usecase.interface";
import type { IDeleteAvailabilityUseCase } from "../../../application/modules/availability-management/use-cases/delete-availability.usecase.interface";
import type { IGetMentorAvailabilitiesUseCase } from "../../../application/modules/availability-management/use-cases/get-mentor-availabilities.usecase.interface";
import type { IReenableAvailabilityUseCase } from "../../../application/modules/availability-management/use-cases/reenable-availability.usecase.interface";
import type { IUpdateAvailabilityUseCase } from "../../../application/modules/availability-management/use-cases/update-availability.usecase.interface";
import { getMentorByUserIdOrThrow } from "../../../application/shared/utilities/mentor.util";
import type { IMentorWriteRepository } from "../../../domain/repositories/mentor-write.repository.interface";

import { HttpStatus } from "../../../shared/constants/http-status-codes";
import logger from "../../../shared/logging/logger";
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
		@inject(TYPES.UseCases.CheckAndCreateAvailability)
		private readonly _checkAndCreateAvailabilityUseCase: ICheckAndCreateAvailabilityUseCase,
		@inject(TYPES.UseCases.UpdateAvailability)
		private readonly _updateAvailabilityUseCase: IUpdateAvailabilityUseCase,
		@inject(TYPES.UseCases.DeleteAvailability)
		private readonly _deleteAvailabilityUseCase: IDeleteAvailabilityUseCase,
		@inject(TYPES.UseCases.GetMentorAvailabilities)
		private readonly _getMentorAvailabilitiesUseCase: IGetMentorAvailabilitiesUseCase,
		@inject(TYPES.UseCases.ReenableAvailability)
		private readonly _reenableAvailabilityUseCase: IReenableAvailabilityUseCase,
		@inject(TYPES.Repositories.MentorWriteRepository)
		private readonly _mentorWriteRepository: IMentorWriteRepository,
	) {}

	createAvailability = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			userId,
		);
		const { body } = req.validated as {
			body: z.infer<typeof createAvailabilitySchema.body>;
		};

		const result = await this._createAvailabilityUseCase.execute({
			mentorId: mentor.id,
			...body,
		});

		return sendSuccess(res, HttpStatus.CREATED, {
			message: RESPONSE_MESSAGES.AVAILABILITY.CREATED,
			data: result.availabilityId,
		});
	});

	checkAndCreateAvailability = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			userId,
		);
		const { body } = req.validated as {
			body: z.infer<typeof createAvailabilitySchema.body>;
		};

		const result = await this._checkAndCreateAvailabilityUseCase.execute({
			mentorId: mentor.id,
			...body,
		});

		if (result.created) {
			return sendSuccess(res, HttpStatus.CREATED, {
				message: RESPONSE_MESSAGES.AVAILABILITY.CREATED,
				data: result,
			});
		}

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.AVAILABILITY.CONFLICT,
			data: result,
		});
	});

	updateAvailability = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			userId,
		);
		const { params, body } = req.validated as {
			params: z.infer<typeof updateAvailabilitySchema.params>;
			body: z.infer<typeof updateAvailabilitySchema.body>;
		};

		const result = await this._updateAvailabilityUseCase.execute({
			availabilityId: params.id,
			mentorId: mentor.id,
			...body,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.AVAILABILITY.UPDATED,
			data: result.availabilityId,
		});
	});

	deleteAvailability = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			userId,
		);
		const { params } = req.validated as {
			params: z.infer<typeof availabilityIdParamSchema.params>;
		};

		await this._deleteAvailabilityUseCase.execute({
			availabilityId: params.id,
			mentorId: mentor.id,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.AVAILABILITY.DELETED,
		});
	});

	reenableAvailability = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			userId,
		);
		const { params } = req.validated as {
			params: z.infer<typeof availabilityIdParamSchema.params>;
		};

		await this._reenableAvailabilityUseCase.execute({
			availabilityId: params.id,
			mentorId: mentor.id,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.AVAILABILITY.UPDATED,
		});
	});

	getMentorAvailabilities = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const mentor = await getMentorByUserIdOrThrow(
			this._mentorWriteRepository,
			userId,
		);
		const { query } = req.validated as {
			query: z.infer<typeof getMentorAvailabilitiesSchema.query>;
		};

		logger.debug(
			{ userId, mentorId: mentor.id, mentorUserId: mentor.userId },
			"Fetching mentor availabilities",
		);

		let result = await this._getMentorAvailabilitiesUseCase.execute({
			mentorId: mentor.id,
			expired: query.expired,
			status: query.status,
		});

		if (
			result.availabilities.length === 0 &&
			mentor.userId &&
			mentor.userId !== mentor.id
		) {
			const legacyResult = await this._getMentorAvailabilitiesUseCase.execute({
				mentorId: mentor.userId,
				expired: query.expired,
				status: query.status,
			});
			if (legacyResult.availabilities.length > 0) {
				logger.warn(
					{ mentorId: mentor.id, legacyMentorId: mentor.userId },
					"Using legacy mentorId for availability lookup",
				);
				result = legacyResult;
			}
		}

		logger.debug(
			{ count: result.availabilities.length },
			"Mentor availabilities fetched",
		);

		return sendSuccess(res, HttpStatus.OK, {
			message: RESPONSE_MESSAGES.AVAILABILITY.RETRIEVED,
			data: result,
		});
	});
}
