import { DeleteCommentDto } from "../../../application/dtos/article-comment.dto";

export interface IDeleteCommentUC {
	execute(dto: DeleteCommentDto): Promise<void>;
}
