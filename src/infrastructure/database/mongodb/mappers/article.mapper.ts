import { Types } from "mongoose";
import { Article } from "../../../../domain/entities/article.entity";
import type { ArticleDocument } from "../models/article.model";

export class ArticleMapper {
	static toDomain(doc: ArticleDocument): Article {
		return new Article(
			doc._id.toString(),
			doc.authorId.toString(),
			{
				name: doc.authorSnapshot.name,
				avatarUrl: doc.authorSnapshot.avatarUrl || undefined,
				isBlocked: doc.authorSnapshot.isBlocked,
			},
			doc.slug,
			doc.featuredImageUrl,
			doc.title,
			doc.description,
			doc.previewContent,
			doc.tags,
			doc.isActive,
			doc.views,
			doc.commentsCount,
			doc.likesCount,
			doc.isArchived,
			doc.isBlockedByAdmin ?? false,
			doc.blockingReason ?? null,
			doc.blockedAt ?? null,
			doc.blockedByReportId ? doc.blockedByReportId.toString() : null,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(entity: Article): Partial<ArticleDocument> {
		return {
			authorId: new Types.ObjectId(entity.authorId),
			authorSnapshot: {
				name: entity.authorSnapshot.name,
				avatarUrl: entity.authorSnapshot.avatarUrl,
				isBlocked: entity.authorSnapshot.isBlocked,
			},
			slug: entity.slug,
			featuredImageUrl: entity.featuredImageUrl,
			title: entity.title,
			description: entity.description,
			previewContent: entity.previewContent,
			tags: entity.tags,
			isActive: entity.isActive,
			views: entity.views,
			commentsCount: entity.commentsCount,
			likesCount: entity.likesCount,
			isArchived: entity.isArchived,
			isBlockedByAdmin: entity.isBlockedByAdmin,
			blockingReason: entity.blockingReason,
			blockedAt: entity.blockedAt,
			blockedByReportId: entity.blockedByReportId
				? new Types.ObjectId(entity.blockedByReportId)
				: null,
			...(entity.createdAt && { createdAt: entity.createdAt }),
		};
	}
}
