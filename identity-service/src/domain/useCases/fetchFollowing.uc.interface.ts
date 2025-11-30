import { ConnectionsResponseDto } from "../../application/dtos/connection.dto";

export interface IFetchFollowingUC {
	execute(
		userId: string,
		page: number,
		limit: number,
	): Promise<ConnectionsResponseDto>;
}
