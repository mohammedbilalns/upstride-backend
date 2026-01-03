import { UpdateCommentDto } from "../../../application/dtos/articleComment.dto";

export interface IUpdateCommentUC {
	execute(dto: UpdateCommentDto): Promise<void>;
}
