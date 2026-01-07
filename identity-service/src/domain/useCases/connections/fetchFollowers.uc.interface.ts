import type {
	ConnectionsResponseDto,
	FetchFollowersDto,
} from "../../../application/dtos/connection.dto";

export interface IFetchFollowersUC {
	execute(dto: FetchFollowersDto): Promise<ConnectionsResponseDto>;
}
