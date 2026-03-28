import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import { UserNotFoundError } from "../../authentication/errors";
import type {
	GetProfileInput,
	GetProfileOutput,
} from "../dtos/get-profile.dto";
import { ProfileMapper } from "../mappers/profile.mapper";
import type { IGetProfileUseCase } from "./get-profile.usecase.interface";

@injectable()
export class GetProfileUseCase implements IGetProfileUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetProfileInput): Promise<GetProfileOutput> {
		const user = await this._userRepository.findProfileById(input.userId);

		if (!user) {
			throw new UserNotFoundError();
		}

		let profilePictureUrl: string | null = null;
		if (user.profilePictureId) {
			profilePictureUrl = this._storageService.getPublicUrl(
				user.profilePictureId,
			);
		}

		return {
			profile: ProfileMapper.toDTO(user, profilePictureUrl),
		};
	}
}
