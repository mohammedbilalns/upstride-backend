import {
	FetchCommentsDto,
	fetchCommentsResponseDto,
} from "../../../application/dtos/article-comment.dto";

export interface IGetCommentsUC {
	execute(dto: FetchCommentsDto): Promise<fetchCommentsResponseDto>;
}
