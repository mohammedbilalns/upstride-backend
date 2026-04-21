import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { mapPaginatedResult } from "../../../shared/utilities/pagination.util";
import { buildUserListQuery } from "../../../shared/utilities/user-list.util";
import type { GetUsersInput, GetUsersResponse } from "../dtos/get-users.dto";
import { UserListMapper } from "../mappers/user-list.mapper";
import type { IGetUsersUseCase } from "./get-users.use-case.interface";

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(input: GetUsersInput): Promise<GetUsersResponse> {
		const { query, sort } = buildUserListQuery({
			search: input.search,
			status: input.status,
			sort: input.sort,
			role: input.role,
			defaultRole: ["USER", "MENTOR"],
		});

		const result = await this._userRepository.paginate({
			page: input.page,
			limit: input.limit,
			query,
			sort,
		});

		const { items, ...meta } = mapPaginatedResult(
			result,
			UserListMapper.toDTOs,
		);
		return { ...meta, users: items };
	}
}
