import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { mapPaginatedResult } from "../../../shared/utilities/pagination.util";
import { buildUserListQuery } from "../../../shared/utilities/user-list.util";
import type { GetAdminsInput, GetAdminsResponse } from "../dtos/get-admins.dto";
import { AdminListMapper } from "../mappers/admin-list.mapper";
import type { IGetAdminsUseCase } from "./get-admins.usecase.interface";

@injectable()
export class GetAdminsUseCase implements IGetAdminsUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
	) {}

	async execute(input: GetAdminsInput): Promise<GetAdminsResponse> {
		const { query, sort } = buildUserListQuery({
			search: input.search,
			status: input.status,
			sort: input.sort,
			defaultRole: "ADMIN",
		});

		const result = await this._userRepository.paginate({
			page: input.page,
			limit: input.limit,
			query,
			sort,
		});

		const { items, ...meta } = mapPaginatedResult(
			result,
			AdminListMapper.toDTOs,
		);
		return { ...meta, admins: items };
	}
}
