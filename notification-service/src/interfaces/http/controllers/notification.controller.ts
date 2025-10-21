import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type { INotificationService } from "../../../domain/services/notification.service.interface";
import asyncHandler from "../utils/asyncHandler";
import {
	fetchNotificationsValidationSchema,
	markNotificationAsReadValidationSchema,
} from "../validations/notification.validation";

export class NotificationController {
	constructor(private _notificationService: INotificationService) {}

	// createNotification= asyncHandler( async (req, res) => {
	//
	// 	const data = notificationValidationSchema.parse(req.body);
	//
	// 	await this._notificationService.saveNotification({userId: res.locals.user.id, ...data});
	// 	return res.status(HttpStatus.OK).json({success: true, message:ResponseMessage.NOTIFICATION_CREATED});
	//
	// })

	markNotificationAsRead = asyncHandler(async (req, res) => {
		const { notificationId } = markNotificationAsReadValidationSchema.parse(
			req.params,
		);

		await this._notificationService.markNotificationAsRead(notificationId);
		return res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.NOTIFICAION_READ });
	});

	fetchUserNotifications = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { page, limit } = fetchNotificationsValidationSchema.parse(req.query);
		const { notifications, total } =
			await this._notificationService.fetchUserNotifications(
				userId,
				page,
				limit,
			);
		return res.status(HttpStatus.OK).send({ notifications, total });
	});


	markAllNotificationsAsRead = asyncHandler(async (_req, res) => {
		const userId = res.locals.user.id;
		await this._notificationService.makrAllNotificationsAsRead(userId);
		return res.status(HttpStatus.OK).json({ success: true, message: ResponseMessage.NOTIFICAION_READ });
	});
}
