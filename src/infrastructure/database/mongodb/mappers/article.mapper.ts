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
			doc.isArchived,
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
			isArchived: entity.isArchived,
			...(entity.createdAt && { createdAt: entity.createdAt }),
		};
	}
}
