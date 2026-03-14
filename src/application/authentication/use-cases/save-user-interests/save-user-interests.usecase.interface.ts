import type {
	SaveUserInterestsInput,
	SaveUserInterestsResponse,
} from "../../dtos";

export interface ISaveUserInterestsUseCase {
	execute(input: SaveUserInterestsInput): Promise<SaveUserInterestsResponse>;
}
