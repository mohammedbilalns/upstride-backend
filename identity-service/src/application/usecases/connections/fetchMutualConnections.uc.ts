import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { IFetchMutualConnectionsUC } from "../../../domain/useCases/connections/fetchMutualConnections.uc.interface";
import { MutualConnectionsResponseDto } from "../../dtos/connection.dto";

export class FetchMutualConnectionsUC implements IFetchMutualConnectionsUC {
	constructor(private _connectionRepository: IConnectionRepository) {}

	async execute(userId: string): Promise<MutualConnectionsResponseDto> {
		const { connections, total } =
			await this._connectionRepository.fetchMutualConnections(userId, 5);

		return {
			connections,
			total,
		};
	}
}
