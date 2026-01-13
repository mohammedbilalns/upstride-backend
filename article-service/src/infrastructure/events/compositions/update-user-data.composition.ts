import { AuthorService } from "../../../application/services/author.service";
import type {
	IArticleCommentRepository,
	IArticleRepository,
} from "../../../domain/repositories";
import type { IAuthorService } from "../../../domain/services/author.service.interface";
import {
	ArticleCommentRepository,
	ArticleRepository,
} from "../../database/repositories";
import { createUpdateUserDataConsumer } from "../consumers/updateUserData.consumer";

export async function composeUpdateUserData() {
	const articleRepository: IArticleRepository = new ArticleRepository();
	const commentRepository: IArticleCommentRepository =
		new ArticleCommentRepository();
	const authorService: IAuthorService = new AuthorService(
		articleRepository,
		commentRepository,
	);
	await createUpdateUserDataConsumer(authorService);
}
