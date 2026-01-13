import { UserRole } from "../../../common/enums/user-roles";
import { IUserRepository } from "../../../domain/repositories";
import { IFetchUsersUC } from "../../../domain/useCases/userManagement/fetch-users.uc.interface";
import { AdminUserDTO, FetchUsersDto } from "../../dtos";

export class FetchUsersUC implements IFetchUsersUC {
	constructor(private _userRepository: IUserRepository) {}

	async execute(
		dto: FetchUsersDto,
	): Promise<{ users: AdminUserDTO[]; total: number }> {
		const { userRole, page, limit, query } = dto;
		let allowedRoles: string[] = [];

		if (userRole === UserRole.ADMIN) {
			allowedRoles = [UserRole.USER, UserRole.MENTOR];
		} else if (userRole === UserRole.SUPER_ADMIN) {
			allowedRoles = [UserRole.ADMIN, UserRole.USER, UserRole.MENTOR];
		}

		const [users, total] = await Promise.all([
			this._userRepository.findAll(page, limit, allowedRoles, query),
			this._userRepository.count(allowedRoles),
		]);

		const safeUsers: AdminUserDTO[] = users.map(
			({ id, name, email, role, isBlocked, createdAt }) => ({
				id,
				name,
				email,
				isBlocked,
				role,
				createdAt,
			}),
		);

		return { users: safeUsers, total };
	}
}
