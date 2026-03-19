import { inject, injectable } from "inversify";
import type { IUserRepository, UserQuery } from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
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
		const query: UserQuery = {
			search: input.search,
			role: "ADMIN",
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
			admins: AdminListMapper.toDTOs(result.items),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
