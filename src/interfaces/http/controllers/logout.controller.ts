import { inject, injectable } from "inversify";
import type { IGetActiveSessionsUseCase } from "../../../application/authentication/use-cases/logout/get-active-sessions.usecase.interface";
import type { ILogoutUseCase } from "../../../application/authentication/use-cases/logout/logout.usecase.interface";
import type { IRevokeAllOtherSessionsUseCase } from "../../../application/authentication/use-cases/logout/revoke-all-other-sessions.usecase.interface";
import type { IRevokeSessionUseCase } from "../../../application/authentication/use-cases/logout/revoke-session.usecase.interface";
import env from "../../../shared/config/env";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { AuthResponseMessages } from "../constants/response-messages";
import { asyncHandler, sendSuccess } from "../helpers";
import type { RevokeSessionBody } from "../validators/auth";

@injectable()
export class LogoutController {
	constructor(
		@inject(TYPES.UseCases.Logout)
		private _logoutUseCase: ILogoutUseCase,
		@inject(TYPES.UseCases.RevokeSession)
		private _revokeSessionUseCase: IRevokeSessionUseCase,
		@inject(TYPES.UseCases.RevokeAllOtherSessions)
		private _revokeAllOtherSessionsUseCase: IRevokeAllOtherSessionsUseCase,
		@inject(TYPES.UseCases.GetActiveSessions)
		private _getActiveSessionsUseCase: IGetActiveSessionsUseCase,
	) {}

	logout = asyncHandler(async (req, res) => {
		const sessionId = (req as AuthenticatedRequest).user.sid;

		await this._logoutUseCase.execute({ sessionId });

		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: env.NODE_ENV === "production",
			sameSite: "strict",
		});

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.LOGOUT_SUCCESS,
		});
	});

	revokeSession = asyncHandler(async (req, res) => {
		const requesterUserId = (req as AuthenticatedRequest).user.id;
		const { targetSessionId } = req.body as RevokeSessionBody;

		await this._revokeSessionUseCase.execute({
			requesterUserId,
			targetSessionId,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.SESSION_REVOKED,
		});
	});

	revokeAllOtherSessions = asyncHandler(async (req, res) => {
		const requesterUserId = (req as AuthenticatedRequest).user.id;
		const requesterSessionId = (req as AuthenticatedRequest).user.sid;

		await this._revokeAllOtherSessionsUseCase.execute({
			requesterUserId,
			requesterSessionId,
		});

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.ALL_OTHER_SESSIONS_REVOKED,
		});
	});

	getActiveSessions = asyncHandler(async (req, res) => {
		const { id: userId, sid: currentSessionId } = (req as AuthenticatedRequest)
			.user;

		const data = await this._getActiveSessionsUseCase.execute(
			{ userId },
			currentSessionId,
		);

		sendSuccess(res, HttpStatus.OK, {
			message: AuthResponseMessages.FETCH_SESSIONS_SUCCESS,
			data,
		});
	});
}
