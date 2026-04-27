import type { GetAdminsInput, GetAdminsResponse } from "../dtos/get-admins.dto";

export interface IGetAdminsUseCase {
	execute(input: GetAdminsInput): Promise<GetAdminsResponse>;
}
