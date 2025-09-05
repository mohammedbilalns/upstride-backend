import { IArticleRectionService } from "../../domain/services/articleRection.service.interface";
import { IArticleReactionRepository, IArticleRepository } from "../../domain/repositories";
import { ArticleReactionDto } from "../dtos/articleReaction.dto";
import { ArticleReaction } from "../../domain/entities/articleReaction.entity";
import { ErrorMessage,HttpStatus } from "../../common/enums";

import { AppError } from "../errors/AppError";

export class ArticleReactionService  implements IArticleRectionService {
	constructor(
		private _articleRectionRepository: IArticleReactionRepository,
		private _articleRepository: IArticleRepository,
	){}

	async reactToArticle(articleReactionDto: ArticleReactionDto): Promise<void> {
		const {articleId, userId, reaction} = articleReactionDto;
		const article = await this._articleRepository.findById(articleId);
		if(!article) throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
		const existingReaction = await this._articleRectionRepository.findByArticleAndUser(articleId,userId);
		if(existingReaction){
			if(existingReaction.reaction === reaction){
				throw new AppError(ErrorMessage.ARTICLE_ALREADY_REACTED, HttpStatus.BAD_REQUEST);
			}
			await this._articleRectionRepository.update(existingReaction.id,{reaction});

		}else{
			await this._articleRectionRepository.create({
				articleId,
				userId,
				reaction,
			});
		}
		if(reaction === "like"){
				this._articleRepository.update(article.id,{likes: article.likes + 1});
		}else if(reaction === "dislike"){
			this._articleRepository.update(article.id,{likes: article.likes - 1});
		}	
	}

	async getReactions(articleId: string, page:number, limit: number): Promise<Partial<ArticleReaction>[]> {
	 	return await this._articleRectionRepository.findByArticle(articleId, page,limit);
	}
}
