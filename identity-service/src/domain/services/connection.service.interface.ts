import type {
	fetchFollowersResponseDto,
	fetchFollowingResponseDto,
} from "../../application/dtos/connection.dto";

export interface IConnectionService {
	follow(userId: string, mentorId: string): Promise<void>;
	unfollow(userId: string, mentorId: string): Promise<void>;
	fetchFollowers(
		mentorId: string,
		page: number,
		limit: number,
	): Promise<fetchFollowersResponseDto>;
	fetchFollowing(
		userId: string,
		page: number,
		limit: number,
	): Promise<fetchFollowingResponseDto>;
}
