import { ConnectionsResponseDto } from "../../../application/dtos/connection.dto";

export interface IFetchFollowersUC {
	execute(
		userId: string,
		page: number,
		limit: number,
	): Promise<ConnectionsResponseDto>;
}
