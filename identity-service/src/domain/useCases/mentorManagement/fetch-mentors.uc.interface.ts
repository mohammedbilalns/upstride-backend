import {
	findAllMentorsDto,
	findAllMentorsResponseDto,
} from "../../../application/dtos";

export interface IFetchMentorsUC {
	execute(dto: findAllMentorsDto): Promise<findAllMentorsResponseDto>;
}
