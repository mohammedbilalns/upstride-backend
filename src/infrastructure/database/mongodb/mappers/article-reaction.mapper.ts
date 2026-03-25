import { Types } from "mongoose";
import { ArticleReaction } from "../../../../domain/entities/article-reaction.entity";
import type { ArticleReactionDocument } from "../models/article-reaction.model";

export class ArticleReactionMapper {
	static toDomain(doc: ArticleReactionDocument): ArticleReaction {
		return new ArticleReaction(
			doc._id.toString(),
			doc.resourceId.toString(),
			doc.userId.toString(),
			doc.reactionType,
			doc.createdAt,
		);
	}

	static toDocument(entity: ArticleReaction): Partial<ArticleReactionDocument> {
		return {
			resourceId: new Types.ObjectId(entity.resourceId),
			userId: new Types.ObjectId(entity.userId),
			reactionType: entity.reactionType,
			...(entity.createdAt && { createdAt: entity.createdAt }),
		};
	}
}
