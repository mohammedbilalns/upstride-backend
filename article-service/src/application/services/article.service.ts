import { IArticleService } from "../../domain/services/article.service.interface";
import { IArticleRepository,ITagRepository,IArticleViewRepository, IArticleReactionRepository } from "../../domain/repositories";
import { Article } from "../../domain/entities/article.entity";
import { AppError } from "../errors/AppError";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import { CreateArticleDto, FetchArticlesDto, FetchArticlesResponseDto, UpdateArticleDto } from "../dtos/article.dto";


export class ArticleService implements IArticleService {
	constructor(
		private _articleRepository: IArticleRepository,
		private _tagRepository : ITagRepository,
		private _articleViewRepository: IArticleViewRepository ,
		private _articleReactionRepository: IArticleReactionRepository
		
	){}

private generateDescription(content: string): string {
  if (!content) return '';
  
  const plainText = content
    .replace(/<[^>]*>/g, '') 
    .replace(/\s+/g, ' ')    
    .trim();                 
  
  if (plainText.length <= 150) {
    return plainText;
  } 
  const truncated = plainText.substring(0, 150);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated.substring(0, 147) + '...';
}

	async createArticle(createAricleDto: CreateArticleDto): Promise<void> {
		const {content, tags,...rest} = createAricleDto
		const tagIds = await this._tagRepository.createOrIncrement(tags);
		const description = this.generateDescription(content);
		await this._articleRepository.create({
			content,
			description,
			...rest,
			tags: tagIds,
		});
	}

	async getArticleById(id: string, userId: string): Promise<{article: Article, isViewed: boolean, isLiked: boolean}> {
		const article = await this._articleRepository.findById(id);
		if(!article) throw new AppError(ErrorMessage.ARTICLE_NOT_FOUND, HttpStatus.NOT_FOUND);
		await Promise.all([this._articleViewRepository.create({articleId: article.id, userId}), this._articleRepository.update(id,{views:article.views+1})]);
		const isViewed = !!await this._articleViewRepository.findByArticleAndUser(id, userId);
		const isLiked =  !!await this._articleReactionRepository.findByArticleAndUser(id, userId);
		

		return {article, isViewed, isLiked };
	}

	async fetchArticles(fetchArticlesDto: FetchArticlesDto): Promise<FetchArticlesResponseDto> {

		const { page, limit, sortBy, author, category, topic, tag, query} = fetchArticlesDto;
		if(author){
			return  await this._articleRepository.findByAuthor(author, page, limit, sortBy,query);	
		}
		if(category){
			return  await this._articleRepository.findByCategory(category, page, limit , sortBy,query);	
		}
		if(tag){
			return  await this._articleRepository.findByTag(tag, page, limit , sortBy,query);
		}
		if(topic){
			return  await this._articleRepository.findByTopic(topic, page, limit , sortBy, query);
		}	

		return  await this._articleRepository.find(query, page, limit , sortBy);	
	}

	async updateArticle(updateArticleData: UpdateArticleDto): Promise<void> {
		const {content,tags, userId, ...rest} = updateArticleData;
		const article = await this._articleRepository.findById(rest.id);
		if(article?.author !== userId){
			throw new AppError(ErrorMessage.FORBIDDEN_RESOURCE, HttpStatus.FORBIDDEN);
		}
		if(tags){
			const tagIds = await this._tagRepository.createOrIncrement(tags);
			await this._articleRepository.update(rest.id,{tags: tagIds});
		}
		if(content){
			const description = this.generateDescription(content);
			await this._articleRepository.update(rest.id,{content,description});
		}
	}
	async deleteArticle(id: string): Promise<void> {
		await this._articleRepository.delete(id);
	}

}
