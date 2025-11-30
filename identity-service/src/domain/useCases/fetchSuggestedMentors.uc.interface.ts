import { SuggestedMentorsResponseDto } from "../../application/dtos/connection.dto";

export interface IFetchSuggestedMentorsUC {
	execute(
		userId: string,
		page: number,
		limit: number,
	): Promise<SuggestedMentorsResponseDto>;
}
