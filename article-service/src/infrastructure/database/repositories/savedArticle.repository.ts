import { BaseRepository } from "./base.repository";
import { SavedArticle } from "../../../domain/entities/savedArticle.entity";
import { ISavedArticle, SavedArticleModel } from "../models/savedArticle.model";
import { ISavedArticleRepository } from "../../../domain/repositories/savedArticle.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";


export class SavedArticleRepository  extends BaseRepository<SavedArticle,ISavedArticle> implements ISavedArticleRepository {
	constructor() {
		super(SavedArticleModel);
	}
	protected mapToDomain(doc: ISavedArticle): SavedArticle {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			userId: mapped.userId,
			articleId: mapped.articleId.toString(),
		};
	}

	async  getSavedArticles(userId: string, page: number, limit: number, sortBy?: string): Promise<{articles: SavedArticle[], total:number}> {
		const skip = limit * (page - 1);

		const [articles, total] = await Promise.all([
			this._model
			.find({ userId })
			.populate("articleId", "title description authorName authorImage featuredImage tags views comments likes createdAt")
			.sort(sortBy || { createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.exec(),
			this._model.countDocuments({ userId }),
		]);

		return {
			articles: articles.map(this.mapToDomain),
			total,
		};
	    
	}

	
} 
