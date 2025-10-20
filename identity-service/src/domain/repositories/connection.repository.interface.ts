import type { Connection } from "../entities/connection.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IConnectionRepository extends IBaseRepository<Connection> {
	fetchFollowers(
		mentorId: string,
		page: number,
		limit: number,
	): Promise<{ followers: Connection[]; total: number }>;
	fetchFollowing(
		userId: string,
		page: number,
		limit: number,
	): Promise<{ following: Connection[]; total: number }>;
	fetchByUserAndMentor(
		userId: string,
		mentorId: string,
	): Promise<Connection | null>;
}
