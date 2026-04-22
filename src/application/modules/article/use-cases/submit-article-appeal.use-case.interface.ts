export interface SubmitArticleAppealInput {
	articleId: string;
	userId: string;
	message: string;
}

export interface ISubmitArticleAppealUseCase {
	execute(input: SubmitArticleAppealInput): Promise<void>;
}
