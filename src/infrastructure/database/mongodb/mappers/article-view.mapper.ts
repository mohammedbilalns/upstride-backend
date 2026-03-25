import { Types } from "mongoose";
import { ArticleView } from "../../../../domain/entities/article-view.entity";
import type { ArticleViewDocument } from "../models/article-view.model";

export class ArticleViewMapper {
	static toDomain(doc: ArticleViewDocument): ArticleView {
		return new ArticleView(
			doc._id.toString(),
			doc.articleId.toString(),
			doc.userId.toString(),
		);
	}

	static toDocument(entity: ArticleView): Partial<ArticleViewDocument> {
		return {
			articleId: new Types.ObjectId(entity.articleId),
			userId: new Types.ObjectId(entity.userId),
		};
	}
}
