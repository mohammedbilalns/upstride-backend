import { inject, injectable } from "inversify";
import type {
	IBlockAdminUseCase,
	ICreateAdminUseCase,
	IGetAdminsUseCase,
	IUnblockAdminUseCase,
} from "../../../application/modules/admin-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { AdminManagementResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";
import type {
	AdminIdParam,
	AdminsQuery,
	CreateAdminBody,
} from "../validators/admin-management.validator";

@injectable()
export class AdminManagementController {
	constructor(
		@inject(TYPES.UseCases.GetAdmins)
		private _getAdminsUseCase: IGetAdminsUseCase,
		@inject(TYPES.UseCases.CreateAdmin)
		private _createAdminUseCase: ICreateAdminUseCase,
		@inject(TYPES.UseCases.BlockAdmin)
		private _blockAdminUseCase: IBlockAdminUseCase,
		@inject(TYPES.UseCases.UnblockAdmin)
		private _unblockAdminUseCase: IUnblockAdminUseCase,
	) {}

	getAdmins = asyncHandler(async (req, res) => {
		const query = req.validated?.query as AdminsQuery;

		const data = await this._getAdminsUseCase.execute({
			page: query.page,
			limit: query.limit,
			search: query.search,
			status: query.status,
			sort: query.sort,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: AdminManagementResponseMessages.ADMINS_FETCHED_SUCCESS,
			data,
		});
	});

	createAdmin = asyncHandler(async (req, res) => {
		const body = req.validated?.body as CreateAdminBody;

		await this._createAdminUseCase.execute({
			email: body.email,
			password: body.password,
		});

		sendSuccess(res, HttpStatus.CREATED, {
			message: AdminManagementResponseMessages.ADMIN_CREATED_SUCCESS,
		});
	});

	blockAdmin = asyncHandler(async (req, res) => {
		const { id } = req.validated?.params as AdminIdParam;
		await this._blockAdminUseCase.execute({ adminId: id });

		sendSuccess(res, HttpStatus.OK, {
			message: AdminManagementResponseMessages.ADMIN_BLOCKED_SUCCESS,
		});
	});

	unblockAdmin = asyncHandler(async (req, res) => {
		const { id } = req.validated?.params as AdminIdParam;
		await this._unblockAdminUseCase.execute({ adminId: id });

		sendSuccess(res, HttpStatus.OK, {
			message: AdminManagementResponseMessages.ADMIN_UNBLOCKED_SUCCESS,
		});
	});
}
