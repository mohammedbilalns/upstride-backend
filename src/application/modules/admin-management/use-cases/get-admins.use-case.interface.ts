import type { GetAdminsInput, GetAdminsResponse } from "../dtos";

export interface IGetAdminsUseCase {
	execute(input: GetAdminsInput): Promise<GetAdminsResponse>;
}
