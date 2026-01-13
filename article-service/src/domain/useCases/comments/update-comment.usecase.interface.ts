import { UpdateCommentDto } from "../../../application/dtos/article-comment.dto";

export interface IUpdateCommentUC {
	execute(dto: UpdateCommentDto): Promise<void>;
}
