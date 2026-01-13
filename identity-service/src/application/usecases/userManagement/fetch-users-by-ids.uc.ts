import { User } from "../../../domain/entities";
import { IUserRepository } from "../../../domain/repositories";
import { IFetchUsersByIdsUC } from "../../../domain/useCases/userManagement/fetch-users-by-ids.uc.interface";
import { FetchUsersByIdsDto } from "../../dtos/user.dto";

export class FetchUsersByIdsUC implements IFetchUsersByIdsUC {
	constructor(private _userRepository: IUserRepository) {}

	async execute(dto: FetchUsersByIdsDto): Promise<User[]> {
		const { userIds } = dto;
		const users = await this._userRepository.findByUserIds(userIds);
		return users;
	}
}
