import { CreateCommentDto } from "../../../application/dtos/article-comment.dto";

export interface ICreateCommentUc {
	execute(dto: CreateCommentDto): Promise<void>;
}
