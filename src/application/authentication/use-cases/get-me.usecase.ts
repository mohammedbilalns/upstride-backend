import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import type { IStorageService } from "../../services/storage.service.interface";
import type { GetMeInput, GetMeOutput } from "../dtos/get-me.dto";
import { UserNotFoundError } from "../errors";
import { GetMeResponseMapper } from "../mappers/get-me-response.mapper";
import type { IGetMeUseCase } from "./get-me.usecase.interface";

@injectable()
export class GetMeUseCase implements IGetMeUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
	) {}

	async execute(input: GetMeInput): Promise<GetMeOutput> {
		const user = await this._userRepository.findById(input.userId);

		if (!user) throw new UserNotFoundError();

		let profilePictureUrl: string | null = null;
		if (user.profilePictureId) {
			profilePictureUrl = await this._storageService.getSignedUrl(
				user.profilePictureId,
			);
		}

		return GetMeResponseMapper.toDto(user, profilePictureUrl);
	}
}
