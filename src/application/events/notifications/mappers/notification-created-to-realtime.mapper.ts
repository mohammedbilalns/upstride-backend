import type { NotificationCreatedEvent } from "../../../../domain/events/notification-created.event";

export const mapNotificationCreatedToRealtime = (
	event: NotificationCreatedEvent,
) => ({
	userId: event.payload.userId,
	channel: "notification:new",
	payload: {
		notification: event.payload.notification,
	},
});
