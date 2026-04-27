import type { ArticleDto } from "../dtos/article.dto";

export interface UnblockArticleInput {
	adminId: string;
	articleId: string;
}

export interface UnblockArticleOutput {
	resourceId: string;
	article: ArticleDto;
	isUnblocked: boolean;
}

export interface IUnblockArticleUseCase {
	execute(input: UnblockArticleInput): Promise<UnblockArticleOutput>;
}
