import type { BlockArticleInput, BlockArticleOutput } from "../dtos/report.dto";

export interface IBlockArticleUseCase {
	execute(input: BlockArticleInput): Promise<BlockArticleOutput>;
}
