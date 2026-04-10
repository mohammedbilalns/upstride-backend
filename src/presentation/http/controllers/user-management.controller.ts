import { inject, injectable } from "inversify";
import type {
	IBlockUserUseCase,
	IGetUsersUseCase,
	IUnblockUserUseCase,
} from "../../../application/modules/user-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { UserManagementResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";
import type {
	UserIdParam,
	UsersQuery,
} from "../validators/user-management.validator";

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
		const data = await this._getUsersUseCase.execute({
			...(req.validated?.query as UsersQuery),
		});

		sendSuccess(res, HttpStatus.OK, {
			message: UserManagementResponseMessages.USERS_FETCHED_SUCCESS,
			data,
		});
	});

	blockUser = asyncHandler(async (req, res) => {
		//TODO : validate the body using the validator in the route
		const { reportId } = (req.body ?? {}) as { reportId?: string };

		await this._blockUserUseCase.execute({
			userId: (req.validated?.params as UserIdParam).id,
			reportId,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: UserManagementResponseMessages.USER_BLOCKED_SUCCESS,
		});
	});

	unblockUser = asyncHandler(async (req, res) => {
		await this._unblockUserUseCase.execute({
			userId: (req.validated?.params as UserIdParam).id,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: UserManagementResponseMessages.USER_UNBLOCKED_SUCCESS,
		});
	});
}
