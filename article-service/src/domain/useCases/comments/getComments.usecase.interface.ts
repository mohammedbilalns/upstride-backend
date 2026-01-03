import {
	FetchCommentsDto,
	fetchCommentsResponseDto,
} from "../../../application/dtos/articleComment.dto";

export interface IGetCommentsUC {
	execute(dto: FetchCommentsDto): Promise<fetchCommentsResponseDto>;
}
