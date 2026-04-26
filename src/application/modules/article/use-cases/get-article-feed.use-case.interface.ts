import type { GetArticleFeedInput, GetArticlesOutput } from "../dtos";

export interface IGetArticleFeedUseCase {
	execute(input: GetArticleFeedInput): Promise<GetArticlesOutput>;
}
