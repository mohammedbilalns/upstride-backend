import type { PopulatedConnection } from "../../application/dtos/connection.dto";
import type { Connection } from "../entities/connection.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IConnectionRepository extends IBaseRepository<Connection> {
	fetchFollowers(
		mentorId: string,
		page: number,
		limit: number,
	): Promise<Connection[]>;
	fetchFollowing(
		userId: string,
		page: number,
		limit: number,
	): Promise<Connection[]>;
	fetchByUserAndMentor(
		userId: string,
		mentorId: string,
	): Promise<Connection | null>;
	fetchRecentActivity(userId: string): Promise<PopulatedConnection[]>;
	fetchMutualConnections(
		userId: string,
		limit: number,
	): Promise<{ connections: any[]; total: number }>;
}
