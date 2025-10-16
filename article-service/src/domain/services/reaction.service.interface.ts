import type { ReactionDto } from "../../application/dtos/reaction.dto";
import type { Reaction } from "../entities/reaction.entity";

export interface IReactionService {
	reactToResource(ReactionDto: ReactionDto): Promise<void>;
	getReactions(
		resourceId: string,
		page: number,
		limit: number,
	): Promise<Partial<Reaction>[]>;
}
