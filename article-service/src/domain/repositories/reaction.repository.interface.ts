import type { Reaction } from "../entities/reaction.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IReactionRepository extends IBaseRepository<Reaction> {
	findByResource(
		resourceId: string,
		page: number,
		limit: number,
	): Promise<Reaction[]>;

	existsByResourceAndUser(resourceId: string, userId: string): Promise<boolean>;

	findByResourceAndUser(
		resoucrceId: string,
		userId: string,
	): Promise<Reaction | null>;
}
