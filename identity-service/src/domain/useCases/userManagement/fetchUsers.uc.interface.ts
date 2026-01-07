import { AdminUserDTO, FetchUsersDto } from "../../../application/dtos";

export interface IFetchUsersUC {
	execute(
		dto: FetchUsersDto,
	): Promise<{ users: AdminUserDTO[]; total: number }>;
}
