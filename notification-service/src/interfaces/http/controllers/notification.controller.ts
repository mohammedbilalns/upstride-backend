import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IFetchUserNotificationsUC } from "../../../domain/useCases/fetch-user-notifications.usecase.interface";
import { IMarkAllNotificationsAsReadUC } from "../../../domain/useCases/mark-all-notifications-as-read.usecase.interface";
import { IMarkNotificationAsReadUC } from "../../../domain/useCases/mark-notification-as-read.usecase.interface";
import { IMarkChatNotificationsAsReadUC } from "../../../domain/useCases/mark-chat-notifications-as-read.usecase.interface";
import asyncHandler from "../utils/asyncHandler";
import {
	fetchNotificationsValidationSchema,
	markNotificationAsReadValidationSchema,
	markChatNotificationsAsReadValidationSchema,
} from "../validations/notification.validation";

export class NotificationController {
	constructor(
		private _markNotificationAsReadUC: IMarkNotificationAsReadUC,
		private _fetchUserNotificationsUC: IFetchUserNotificationsUC,
		private _markallNotificationsAsReadUC: IMarkAllNotificationsAsReadUC,
		private _markChatNotificationsAsReadUC: IMarkChatNotificationsAsReadUC,
	) {}

	public markNotificationAsRead = asyncHandler(async (req, res) => {
		const { notificationId } = markNotificationAsReadValidationSchema.parse(
			req.params,
		);

		await this._markNotificationAsReadUC.execute({ notificationId });
		return res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.NOTIFICAION_READ });
	});

	public fetchUserNotifications = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { page, limit } = fetchNotificationsValidationSchema.parse(req.query);
		const { notifications, total, unreadCount } =
			await this._fetchUserNotificationsUC.execute({ userId, page, limit });
		return res
			.status(HttpStatus.OK)
			.send({ notifications, total, unreadCount });
	});

	public markAllNotificationsAsRead = asyncHandler(async (_req, res) => {
		const userId = res.locals.user.id;
		await this._markallNotificationsAsReadUC.execute({ userId });
		return res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.NOTIFICAION_READ });
	});

	public markChatNotificationsAsRead = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { chatId } = markChatNotificationsAsReadValidationSchema.parse(
			req.params,
		);

		await this._markChatNotificationsAsReadUC.execute(userId, chatId);

		return res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.NOTIFICAION_READ });
	});
}
