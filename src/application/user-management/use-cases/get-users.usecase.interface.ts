import type { GetUsersInput, GetUsersResponse } from "../dtos/get-users.dto";

export interface IGetUsersUseCase {
	execute(input: GetUsersInput): Promise<GetUsersResponse>;
}
