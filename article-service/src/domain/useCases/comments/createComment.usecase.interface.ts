import { CreateCommentDto } from "../../../application/dtos/articleComment.dto";

export interface ICreateCommentUc {
	execute(dto: CreateCommentDto): Promise<void>;
}
