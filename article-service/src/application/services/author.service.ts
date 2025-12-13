import type {
	IArticleCommentRepository,
	IArticleRepository,
} from "../../domain/repositories";
import type { IAuthorService } from "../../domain/services/author.service.interface";

export class AuthorService implements IAuthorService {
	constructor(
		private _articleRepository: IArticleRepository,
		private _commentRepository: IArticleCommentRepository,
	) {}
	// NOTE : commment author details is not updating

	public async updateAuthor(
		authorId: string,
		authorName: string,
		authorImage: string,
	): Promise<void> {
		await Promise.all([
			this._articleRepository.updateAuthor(authorId, authorName, authorImage),
			this._commentRepository.updateAuthor(authorId, authorName, authorImage),
		]);
	}
}
