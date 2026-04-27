import { Types } from "mongoose";
import { ArticleReaction } from "../../../../domain/entities/article-reaction.entity";
import type { ArticleReactionDocument } from "../models/article-reaction.model";

type PopulatedUserRef = {
	_id: Types.ObjectId;
	name?: string;
};

export type ArticleReactionDocumentWithUser = Omit<
	ArticleReactionDocument,
	"userId"
> & {
	userId: Types.ObjectId | PopulatedUserRef;
};

const isPopulatedUserRef = (
	userId: Types.ObjectId | PopulatedUserRef,
): userId is PopulatedUserRef => {
	return typeof userId === "object" && userId !== null && "_id" in userId;
};

export class ArticleReactionMapper {
	static toDomain(doc: ArticleReactionDocumentWithUser): ArticleReaction {
		const userId = doc.userId;
		const isPopulatedUser = isPopulatedUserRef(userId);
		const actorName = isPopulatedUser ? userId.name : undefined;
		const userIdStr = isPopulatedUser
			? userId._id.toString()
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
