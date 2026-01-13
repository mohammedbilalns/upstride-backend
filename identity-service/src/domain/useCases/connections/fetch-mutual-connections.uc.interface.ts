import { MutualConnectionsResponseDto } from "../../../application/dtos/connection.dto";

export interface IFetchMutualConnectionsUC {
	execute(userId: string): Promise<MutualConnectionsResponseDto>;
}
