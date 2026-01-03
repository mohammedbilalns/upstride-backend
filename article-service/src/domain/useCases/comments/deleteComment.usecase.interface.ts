import { DeleteCommentDto } from "../../../application/dtos/articleComment.dto";

export interface IDeleteCommentUC {
	execute(dto: DeleteCommentDto): Promise<void>;
}
