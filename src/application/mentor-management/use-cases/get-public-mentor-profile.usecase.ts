import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import type { IMentorRepository } from "../../../domain/repositories/mentor.repository.interface";
import type { ISessionSlotRepository } from "../../../domain/repositories/session-slot.repository.interface";
import { TYPES } from "../../../shared/types/types";
import { MentorNotFoundError } from "../../mentor-lists/errors";
import type { IStorageService } from "../../services/storage.service.interface";
import { ValidationError } from "../../shared/errors/validation-error";
import type {
	GetPublicMentorProfileInput,
	GetPublicMentorProfileResponse,
} from "../dtos/get-public-mentor-profile.dto";
import { MentorPublicProfileMapper } from "../mappers/mentor-public-profile.mapper";
import type { IGetPublicMentorProfileUseCase } from "./get-public-mentor-profile.usecase.interface";

@injectable()
export class GetPublicMentorProfileUseCase
	implements IGetPublicMentorProfileUseCase
{
	constructor(
		@inject(TYPES.Repositories.MentorRepository)
		private readonly _mentorRepository: IMentorRepository,
		@inject(TYPES.Repositories.SessionSlotRepository)
		private readonly _sessionSlotRepository: ISessionSlotRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute({
		mentorId,
		requesterUserId,
	}: GetPublicMentorProfileInput): Promise<GetPublicMentorProfileResponse> {
		if (!Types.ObjectId.isValid(mentorId)) {
			throw new MentorNotFoundError();
		}

		const profile = await this._mentorRepository.findProfileById(mentorId);
		if (!profile || !profile.isApproved || profile.isRejected) {
			throw new MentorNotFoundError();
		}

		if (profile.userId === requesterUserId) {
			throw new ValidationError(
				"Mentor cannot access their own public profile",
			);
		}

		const upcomingSlots =
			await this._sessionSlotRepository.findUpcomingAvailableByMentorId(
				profile.id,
				3,
				new Date(),
			);

		const avatar = profile.user.profilePictureId
			? await this._storageService.getSignedUrl(profile.user.profilePictureId)
			: undefined;

		return {
			profile: MentorPublicProfileMapper.toDto(profile, avatar),
			nextAvailableSessions: upcomingSlots.map((slot) => ({
				id: slot.id,
				startTime: slot.startTime,
				endTime: slot.endTime,
				durationMinutes: slot.durationMinutes,
				price: slot.price,
				currency: slot.currency,
			})),
		};
	}
}
