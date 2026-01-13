import { DeleteArticleDto } from "../../../../application/dtos/article.dto";

export interface IDeleteArticleUC {
	execute(dto: DeleteArticleDto): Promise<void>;
}
