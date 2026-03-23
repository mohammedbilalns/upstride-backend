import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import type { IMentorRepository } from "../../../../domain/repositories/mentor.repository.interface";
import type { ISessionSlotRepository } from "../../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { MentorNotFoundError } from "../../../shared/errors/mentor-not-found.error";
import { ValidationError } from "../../../shared/errors/validation-error";
import type {
	GetPublicMentorAvailableSlotsInput,
	GetPublicMentorAvailableSlotsResponse,
} from "../dtos/public-mentor-slots.dto";
import { PublicMentorAvailableSlotMapper } from "../mappers/public-mentor-available-slot.mapper";
import type { IGetPublicMentorAvailableSlotsUseCase } from "./get-public-mentor-available-slots.usecase.interface";

@injectable()
export class GetPublicMentorAvailableSlotsUseCase
	implements IGetPublicMentorAvailableSlotsUseCase
{
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _sessionSlotRepository: ISessionSlotRepository,
	) {}

	async execute({
		mentorId,
		requesterUserId,
		date,
	}: GetPublicMentorAvailableSlotsInput): Promise<GetPublicMentorAvailableSlotsResponse> {
		//FIX: move the objectid validation to the route level validator
		if (!Types.ObjectId.isValid(mentorId)) {
			throw new MentorNotFoundError();
		}

		const mentor = await this._mentorRepository.findById(mentorId);
		if (!mentor || !mentor.isApproved || mentor.isRejected) {
			throw new MentorNotFoundError();
		}

		if (mentor.userId === requesterUserId) {
			throw new ValidationError(
				"Mentor cannot access their own public profile",
			);
		}

		const startOfDay = new Date(`${date}T00:00:00.000Z`);
		const endOfDay = new Date(`${date}T23:59:59.999Z`);
		if (
			Number.isNaN(startOfDay.getTime()) ||
			Number.isNaN(endOfDay.getTime())
		) {
			throw new ValidationError("Invalid date format");
		}

		const slots =
			await this._sessionSlotRepository.findAvailableByMentorIdAndRange(
				mentorId,
				startOfDay,
				endOfDay,
			);

		return {
			slots: PublicMentorAvailableSlotMapper.toDTOs(slots),
		};
	}
}
