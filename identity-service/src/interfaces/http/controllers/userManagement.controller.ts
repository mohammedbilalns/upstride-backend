import { IUserManagementService } from "../../../domain/services/userManagement.service.interface";
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { paginationQuerySchema } from "../validations/pagination.validation";

export class UserManagementController {
  constructor(private _userManagementService: IUserManagementService) {}

  fetchUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = paginationQuerySchema.parse(req.query);
    const { page, limit, query } = result;
    const userRole = res.locals.user?.role;

    const { users, total } = await this._userManagementService.fetchUsers(
      userRole,
      page,
      limit,
      query,
    );
    res.status(HttpStatus.OK).json({ data: users, total });
  });

  blockUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    await this._userManagementService.blockUser(userId);
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: ResponseMessage.USER_BLOCKED });
  });

  unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    await this._userManagementService.unblockUser(userId);
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: ResponseMessage.USER_UNBLOCKED });
  });
}
