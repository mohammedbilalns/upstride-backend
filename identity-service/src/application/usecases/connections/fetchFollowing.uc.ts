import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { IFetchFollowingUC } from "../../../domain/useCases/connections/fetchFollowing.uc.interface";
import { ConnectionsResponseDto } from "../../dtos/connection.dto";

export class FetchFollowingUC implements IFetchFollowingUC {
	constructor(private _connectionRepository: IConnectionRepository) {}

	async execute(
		userId: string,
		page: number,
		limit: number,
	): Promise<ConnectionsResponseDto> {
		const following = await this._connectionRepository.fetchFollowing(
			userId,
			page,
			limit,
		);
		return following;
	}
}
