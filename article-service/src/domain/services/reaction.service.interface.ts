import type { Reaction } from "../entities/reaction.entity";
import { ReactionDto } from "../../application/dtos/reaction.dto";

export interface IReactionService {
	reactToResource(ReactionDto: ReactionDto): Promise<void>;
	getReactions(
		resourceId: string,
		page: number,
		limit: number,
	): Promise<Partial<Reaction>[]>;
}
