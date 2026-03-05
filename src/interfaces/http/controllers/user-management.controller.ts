import { inject, injectable } from "inversify";
import type { GetUsersInput } from "../../../application/user-management/dtos/get-users.dto";
import type { IGetUsersUseCase } from "../../../application/user-management/use-cases/get-users.usecase.interface";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { UserManagementResponseMessages } from "../constants/response-messages";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class UserManagementController {
	constructor(
		@inject(TYPES.UseCases.GetUsers)
		private _getUsersUseCase: IGetUsersUseCase,
	) {}

	getUsers = asyncHandler(async (req, res) => {
		const query = req.validated?.query as GetUsersInput;

		const data = await this._getUsersUseCase.execute({
			page: query.page,
			limit: query.limit,
			search: query.search,
			role: query.role,
			status: query.status,
			sort: query.sort,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: UserManagementResponseMessages.USERS_FETCHED_SUCCESS,
			data,
		});
	});
}
