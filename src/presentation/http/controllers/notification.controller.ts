import type { Response } from "express";
import { inject, injectable } from "inversify";
import type {
	IGetNotificationsUseCase,
	IGetUnreadNotificationCountUseCase,
	IMarkAllNotificationsReadUseCase,
	IMarkNotificationReadUseCase,
} from "../../../application/modules/notifications/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class NotificationController {
	constructor(
		@inject(TYPES.UseCases.GetNotifications)
		private readonly _getNotificationsUseCase: IGetNotificationsUseCase,
		@inject(TYPES.UseCases.MarkNotificationRead)
		private readonly _markNotificationReadUseCase: IMarkNotificationReadUseCase,
		@inject(TYPES.UseCases.MarkAllNotificationsRead)
		private readonly _markAllNotificationsReadUseCase: IMarkAllNotificationsReadUseCase,
		@inject(TYPES.UseCases.GetUnreadNotificationCount)
		private readonly _getUnreadNotificationCountUseCase: IGetUnreadNotificationCountUseCase,
	) {}

	getNotifications = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const query = (req.validated?.query ?? {}) as Record<string, unknown>;
			const result = await this._getNotificationsUseCase.execute({
				userId: req.user.id,
				...query,
			});

			return sendSuccess(res, HttpStatus.OK, { data: result });
		},
	);

	markRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const { notificationId } = req.validated?.params as {
			notificationId: string;
		};
		const result = await this._markNotificationReadUseCase.execute({
			userId: req.user.id,
			notificationId,
		});

		return sendSuccess(res, HttpStatus.OK, { data: result });
	});

	markAllRead = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const result = await this._markAllNotificationsReadUseCase.execute({
				userId: req.user.id,
			});

			return sendSuccess(res, HttpStatus.OK, { data: result });
		},
	);

	getUnreadCount = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const result = await this._getUnreadNotificationCountUseCase.execute({
				userId: req.user.id,
			});

			return sendSuccess(res, HttpStatus.OK, { data: result });
		},
	);
}
