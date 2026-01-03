import { UpdateArticleDto } from "../../../../application/dtos/article.dto";

export interface IUpdateArticleUC {
	execute(dto: UpdateArticleDto): Promise<void>;
}
