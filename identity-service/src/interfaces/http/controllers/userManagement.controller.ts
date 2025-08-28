import { IUserManagementService } from "../../../domain/services/userManagement.service.interface";
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { HttpStatus, ResponseMessage } from "../../../common/enums";

export class UserManagementController {
  constructor(private _userManagementService: IUserManagementService) {}

  fetchUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : 0;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const query = req.query.query ? String(req.query.query) : undefined;

    const users = await this._userManagementService.fetchUsers(
      page,
      limit,
      query,
    );
    res.status(HttpStatus.OK).json({ data: users });
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
