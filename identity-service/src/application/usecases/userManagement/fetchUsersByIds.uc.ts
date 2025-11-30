import { User } from "../../../domain/entities";
import { IUserRepository } from "../../../domain/repositories";
import { IFetchUsersByIdsUC } from "../../../domain/useCases/userManagement/fetchUsersByIds.uc.interface";

export class FetchUsersByIdsUC implements IFetchUsersByIdsUC {
	constructor(private _userRepository: IUserRepository) {}

	async execute(userIds: string[]): Promise<User[]> {
		const users = await this._userRepository.findByUserIds(userIds);
		return users;
	}
}
