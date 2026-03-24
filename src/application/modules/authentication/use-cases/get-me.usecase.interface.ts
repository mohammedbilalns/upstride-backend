import type { GetMeInput, GetMeOutput } from "../dtos";

export interface IGetMeUseCase {
	execute(input: GetMeInput): Promise<GetMeOutput>;
}
