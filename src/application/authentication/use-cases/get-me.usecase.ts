import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import type { GetMeInput, GetMeOutput } from "../dtos/get-me.dto";
import { UserNotFoundError } from "../errors";
import { GetMeResponseMapper } from "../mappers/get-me-response.mapper";
import type { IGetMeUseCase } from "./get-me.usecase.interface";

@injectable()
export class GetMeUseCase implements IGetMeUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly _userRepository: IUserRepository,
	) {}

	async execute(input: GetMeInput): Promise<GetMeOutput> {
		const user = await this._userRepository.findById(input.usrId);

		if (!user) throw new UserNotFoundError();

		const tempProfilePictureUrl: string = "https://picsum.photos/200";

		return GetMeResponseMapper.toDto(user, tempProfilePictureUrl);
	}
}
