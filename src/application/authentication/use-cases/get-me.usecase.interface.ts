import type { GetMeInput, GetMeOutput } from "../dtos/get-me.dto";

export interface IGetMeUseCase {
	execute(input: GetMeInput): Promise<GetMeOutput>;
}
