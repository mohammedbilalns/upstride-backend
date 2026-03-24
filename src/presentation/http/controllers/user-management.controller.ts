import { inject, injectable } from "inversify";
import type { GetUsersInput } from "../../../application/modules/user-management/dtos/get-users.dto";
import type {
	IBlockUserUseCase,
	IGetUsersUseCase,
	IUnblockUserUseCase,
} from "../../../application/modules/user-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { UserManagementResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class UserManagementController {
	constructor(
		@inject(TYPES.UseCases.GetUsers)
		private _getUsersUseCase: IGetUsersUseCase,
		@inject(TYPES.UseCases.BlockUser)
		private _blockUserUseCase: IBlockUserUseCase,
		@inject(TYPES.UseCases.UnblockUser)
		private _unblockUserUseCase: IUnblockUserUseCase,
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

	blockUser = asyncHandler(async (req, res) => {
		const { id } = req.validated?.params as { id: string };
		await this._blockUserUseCase.execute({ userId: id });

		sendSuccess(res, HttpStatus.OK, {
			message: UserManagementResponseMessages.USER_BLOCKED_SUCCESS,
		});
	});

	unblockUser = asyncHandler(async (req, res) => {
		const { id } = req.validated?.params as { id: string };
		await this._unblockUserUseCase.execute({ userId: id });

		sendSuccess(res, HttpStatus.OK, {
			message: UserManagementResponseMessages.USER_UNBLOCKED_SUCCESS,
		});
	});
}
