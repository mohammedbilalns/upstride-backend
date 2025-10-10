import type { IBaseRepository } from "./base.repository.interface";
import { Reaction } from "../entities/reaction.entity";

export interface IReactionRepository
	extends IBaseRepository<Reaction> {
	findByResource(
		resourceId: string,
		page: number,
		limit: number,
	): Promise<Reaction[]>;
	findByResourceAndUser(
		resoucrceId: string,
		userId: string,
	): Promise<Reaction | null>;
}
