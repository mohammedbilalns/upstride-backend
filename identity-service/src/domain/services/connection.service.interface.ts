import type {
	Activity,
	ConnectionsResponseDto,
	MutualConnectionsResponseDto,
	SuggestedMentorsResponseDto,
} from "../../application/dtos/connection.dto";

export interface IConnectionService {
	follow(userId: string, mentorId: string): Promise<void>;
	unfollow(userId: string, mentorId: string): Promise<void>;
	fetchFollowers(
		mentorId: string,
		page: number,
		limit: number,
	): Promise<ConnectionsResponseDto>;
	fetchFollowing(
		userId: string,
		page: number,
		limit: number,
	): Promise<ConnectionsResponseDto>;
	fetchRecentActivity(userId: string): Promise<Activity[]>;
	fetchSuggestedMentors(
		userId: string,
		page: number,
		limit: number,
	): Promise<SuggestedMentorsResponseDto>;
	fetchMutualConnections(
		userId: string,
		page?: number,
		limit?: number,
	): Promise<MutualConnectionsResponseDto>;
}
