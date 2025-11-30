import type { Request, Response } from "express";
import { HttpStatus, ResponseMessage } from "../../../common/enums";
import asyncHandler from "../utils/asyncHandler";
import { paginationQuerySchema } from "../validations/pagination.validation";
import { fetchByUserIdsParamsSchema } from "../validations/user.validations";
import {
	IBlockUserUC,
	IFetchUsersByIdsUC,
	IFetchUsersUC,
	IUnblockUserUC,
} from "../../../domain/useCases/userManagement";

export class UserManagementController {
	constructor(
		private _blockUserUC: IBlockUserUC,
		private _unblockUserUC: IUnblockUserUC,
		private _fetchUsersUC: IFetchUsersUC,
		private _fetchUsersByIdsUC: IFetchUsersByIdsUC,
	) {}

	fetchUsers = asyncHandler(async (req: Request, res: Response) => {
		const result = paginationQuerySchema.parse(req.query);
		const { page, limit, query } = result;
		const userRole = res.locals.user?.role;

		const { users, total } = await this._fetchUsersUC.execute(
			userRole,
			page,
			limit,
			query,
		);
		res.status(HttpStatus.OK).json({ data: users, total });
	});

	blockUser = asyncHandler(async (req: Request, res: Response) => {
		const userId = req.params.userId;
		await this._blockUserUC.execute(userId);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.USER_BLOCKED });
	});

	unblockUser = asyncHandler(async (req: Request, res: Response) => {
		const userId = req.params.userId;
		await this._unblockUserUC.execute(userId);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.USER_UNBLOCKED });
	});

	fetchByUserIds = asyncHandler(async (req: Request, res: Response) => {
		const { ids } = fetchByUserIdsParamsSchema.parse(req.query);
		const data = await this._fetchUsersByIdsUC.execute(ids);
		res.send(data);
	});
}
