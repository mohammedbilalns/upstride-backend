import { AdminUserDTO } from "../../../application/dtos";

export interface IFetchUsersUC {
	execute(
		userRole: string,
		page: number,
		limit: number,
		query?: string,
	): Promise<{ users: AdminUserDTO[]; total: number }>;
}
