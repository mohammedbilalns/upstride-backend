import { Types } from "mongoose";
import { ArticleReaction } from "../../../../domain/entities/article-reaction.entity";
import type { ArticleReactionDocument } from "../models/article-reaction.model";

export class ArticleReactionMapper {
	static toDomain(doc: any): ArticleReaction {
		const userId = doc.userId;
		const actorName =
			userId && typeof userId === "object" && "name" in userId
				? (userId as any).name
				: undefined;
		const userIdStr =
			userId && typeof userId === "object" && "_id" in userId
				? (userId as any)._id.toString()
				: userId.toString();

		return new ArticleReaction(
			doc._id.toString(),
			doc.resourceId.toString(),
			userIdStr,
			doc.reactionType,
			doc.createdAt,
			actorName,
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
