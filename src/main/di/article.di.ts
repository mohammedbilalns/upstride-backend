import type { Container } from "inversify";
import {
	CreateArticleCommentUseCase,
	CreateArticleUseCase,
	DeleteArticleCommentUseCase,
	DeleteArticleUseCase,
	GetArticleCommentsUseCase,
	GetArticlesUseCase,
	GetArticleTopTagsUseCase,
	GetArticleUseCase,
	type ICreateArticleCommentUseCase,
	type ICreateArticleUseCase,
	type IDeleteArticleCommentUseCase,
	type IDeleteArticleUseCase,
	type IGetArticleCommentsUseCase,
	type IGetArticlesUseCase,
	type IGetArticleTopTagsUseCase,
	type IGetArticleUseCase,
	type IMarkArticleViewUseCase,
	type IReactToArticleCommentUseCase,
	type IReactToArticleUseCase,
	type ISubmitArticleAppealUseCase,
	type IUnblockArticleUseCase,
	type IUpdateArticleCommentUseCase,
	type IUpdateArticleUseCase,
	MarkArticleViewUseCase,
	ReactToArticleCommentUseCase,
	ReactToArticleUseCase,
	SubmitArticleAppealUseCase,
	UnblockArticleUseCase,
	UpdateArticleCommentUseCase,
	UpdateArticleUseCase,
} from "../../application/modules/article-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerArticleBindings = (container: Container): void => {
	container
		.bind<IGetArticlesUseCase>(TYPES.UseCases.GetArticles)
		.to(GetArticlesUseCase)
		.inSingletonScope();
	container
		.bind<IGetArticleTopTagsUseCase>(TYPES.UseCases.GetArticleTopTags)
		.to(GetArticleTopTagsUseCase)
		.inSingletonScope();
	container
		.bind<IGetArticleUseCase>(TYPES.UseCases.GetArticle)
		.to(GetArticleUseCase)
		.inSingletonScope();
	container
		.bind<ICreateArticleUseCase>(TYPES.UseCases.CreateArticle)
		.to(CreateArticleUseCase)
		.inSingletonScope();
	container
		.bind<IUpdateArticleUseCase>(TYPES.UseCases.UpdateArticle)
		.to(UpdateArticleUseCase)
		.inSingletonScope();
	container
		.bind<IDeleteArticleUseCase>(TYPES.UseCases.DeleteArticle)
		.to(DeleteArticleUseCase)
		.inSingletonScope();
	container
		.bind<IMarkArticleViewUseCase>(TYPES.UseCases.MarkArticleView)
		.to(MarkArticleViewUseCase)
		.inSingletonScope();
	container
		.bind<IUnblockArticleUseCase>(TYPES.UseCases.UnblockArticle)
		.to(UnblockArticleUseCase)
		.inSingletonScope();
	container
		.bind<ISubmitArticleAppealUseCase>(TYPES.UseCases.SubmitArticleAppeal)
		.to(SubmitArticleAppealUseCase)
		.inSingletonScope();
	container
		.bind<ICreateArticleCommentUseCase>(TYPES.UseCases.CreateArticleComment)
		.to(CreateArticleCommentUseCase)
		.inSingletonScope();
	container
		.bind<IUpdateArticleCommentUseCase>(TYPES.UseCases.UpdateArticleComment)
		.to(UpdateArticleCommentUseCase)
		.inSingletonScope();
	container
		.bind<IDeleteArticleCommentUseCase>(TYPES.UseCases.DeleteArticleComment)
		.to(DeleteArticleCommentUseCase)
		.inSingletonScope();
	container
		.bind<IGetArticleCommentsUseCase>(TYPES.UseCases.GetArticleComments)
		.to(GetArticleCommentsUseCase)
		.inSingletonScope();
	container
		.bind<IReactToArticleUseCase>(TYPES.UseCases.ReactToArticle)
		.to(ReactToArticleUseCase)
		.inSingletonScope();
	container
		.bind<IReactToArticleCommentUseCase>(TYPES.UseCases.ReactToArticleComment)
		.to(ReactToArticleCommentUseCase)
		.inSingletonScope();
};
