import { BaseRepository } from "./base.repository";
import { IArticleViewRepository } from "../../../domain/repositories/articleView.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { ArticleViewModel, IArticleView } from "../models/articleView.model";
import { ArticleView } from "../../../domain/entities/articleView.entity";

export class ArticleViewRepository extends BaseRepository<ArticleView, IArticleView> implements IArticleViewRepository {
	constructor() {
		super(ArticleViewModel);
	}
	protected mapToDomain(doc: IArticleView): ArticleView {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			articleId: mapped.articleId.toString(),
			userId: mapped.userId,
			createdAt: mapped.createdAt,
		}
	}
	async findByArticle(articleId: string, page: number, limit: number): Promise<ArticleView[]> {
		const articles = await this._model.find({articleId: articleId}).skip(page * limit).limit(limit).lean().exec();
		return articles.map(this.mapToDomain);
	}

	async findByArticleAndUser(articleId: string, userId: string): Promise<ArticleView| null> {
		const article = await this._model.findOne({articleId: articleId, userId: userId}).lean().exec();
		return article ? this.mapToDomain(article) : null;
	}
}
