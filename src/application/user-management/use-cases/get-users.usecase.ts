import { inject, injectable } from "inversify";
import type { IUserRepository, UserQuery } from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import type { GetUsersInput, GetUsersResponse } from "../dtos/get-users.dto";
import { UserListMapper } from "../mappers/user-list.mapper";
import type { IGetUsersUseCase } from "./get-users.usecase.interface";

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(input: GetUsersInput): Promise<GetUsersResponse> {
		const query: UserQuery = {
			search: input.search,
			role: input.role ? input.role : ["USER", "MENTOR"],
			isBlocked:
				input.status === "blocked"
					? true
					: input.status === "active"
						? false
						: undefined,
		};

		const sort: Record<string, 1 | -1> =
			input.sort === "old" ? { createdAt: 1 } : { createdAt: -1 };

		const result = await this._userRepository.paginate({
			page: input.page,
			limit: input.limit,
			query,
			sort,
		});

		return {
			users: UserListMapper.toDTOs(result.items),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
