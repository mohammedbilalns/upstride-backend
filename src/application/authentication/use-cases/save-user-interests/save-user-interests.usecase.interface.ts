import type {
	SaveUserInterestsInput,
	SaveUserInterestsResponse,
} from "../../dtos/save-user-interests.dto";

export interface ISaveUserInterestsUseCase {
	execute(input: SaveUserInterestsInput): Promise<SaveUserInterestsResponse>;
}
