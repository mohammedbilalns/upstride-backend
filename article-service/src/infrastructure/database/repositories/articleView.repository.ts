import type { ArticleView } from "../../../domain/entities/articleView.entity";
import type { IArticleViewRepository } from "../../../domain/repositories/articleView.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import {
	ArticleViewModel,
	type IArticleView,
} from "../models/articleView.model";
import { BaseRepository } from "./base.repository";

export class ArticleViewRepository
	extends BaseRepository<ArticleView, IArticleView>
	implements IArticleViewRepository
{
	constructor() {
		super(ArticleViewModel);
	}
	protected mapToDomain(doc: IArticleView): ArticleView {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			articleId: mapped.articleId.toString(),
			userId: mapped.userId,
		};
	}

	async findByArticleAndUser(
		articleId: string,
		userId: string,
	): Promise<ArticleView | null> {
		const article = await this._model
			.findOne({ articleId: articleId, userId: userId })
			.exec();

		return article ? this.mapToDomain(article) : null;
	}
}
