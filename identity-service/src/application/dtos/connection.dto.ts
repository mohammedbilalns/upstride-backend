import type { Connection } from "../../domain/entities/connection.entity";

export interface fetchFollowersResponseDto {
	followers: Connection[];
	total: number;
}

export interface fetchFollowingResponseDto {
	following: Connection[];
	total: number;
}
