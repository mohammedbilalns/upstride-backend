import { CreateArticleDto } from "../../../../application/dtos/article.dto";

export interface ICreateArticleUC {
	execute(dto: CreateArticleDto): Promise<void>;
}
