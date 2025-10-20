import { NotificationPayloadTypes } from "../enums/notificationPayloadTypes";
import type { NotificationTemplate } from "../types/notification-template.type";

export const NOTIFICATION_TEMPLATES: Record<
	NotificationPayloadTypes,
	NotificationTemplate
> = {
	/** ARTICLE RELATED */
	[NotificationPayloadTypes.REACT_ARTICLE]: {
		getTitle: () => "New reaction on your post",
		getContent: ({ triggeredBy }) => `${triggeredBy} reacted to your post`,
		getLink: ({ targetResource }) => `/articles/${targetResource}`,
		type: "article",
	},

	[NotificationPayloadTypes.REACT_COMMENT]: {
		getTitle: () => "New reaction on your comment",
		getContent: ({ triggeredBy }) => `${triggeredBy} reacted to your comment`,
		getLink: ({ targetResource }) => `/articles/${targetResource}`,
		type: "article",
	},

	[NotificationPayloadTypes.COMMENT_ARTICLE]: {
		getTitle: () => "New comment on your post",
		getContent: ({ triggeredBy }) => `${triggeredBy} commented on your post`,
		getLink: ({ targetResource }) => `/articles/${targetResource}`,
		type: "article",
	},

	[NotificationPayloadTypes.REPLY_COMMENT]: {
		getTitle: () => "New reply to your comment",
		getContent: ({ triggeredBy }) => `${triggeredBy} replied to your comment`,
		getLink: ({ targetResource }) => `/articles/${targetResource}`,
		type: "article",
	},

	/** CHAT RELATED */
	[NotificationPayloadTypes.RECIEVED_MESSAGE]: {
		getTitle: () => "New message received",
		getContent: ({ triggeredBy }) => `${triggeredBy} sent you a message`,
		getLink: ({ targetResource }) => `/chats/${targetResource}`,
		type: "chat",
	},

	/** SESSION RELATED */
	[NotificationPayloadTypes.BOOKED_SESSION]: {
		getTitle: () => "Session booked",
		getContent: ({ triggeredBy }) => `${triggeredBy} booked a session`,
		getLink: ({ targetResource }) => `/sessions/${targetResource}`,
		type: "session",
	},

	[NotificationPayloadTypes.CONFIRMED_SESSION]: {
		getTitle: () => "Session confirmed",
		getContent: ({ triggeredBy }) => `${triggeredBy} confirmed a session`,
		getLink: ({ targetResource }) => `/sessions/${targetResource}`,
		type: "session",
	},

	[NotificationPayloadTypes.CANCELLED_SESSION]: {
		getTitle: () => "Session cancelled",
		getContent: ({ triggeredBy }) => `${triggeredBy} cancelled a session`,
		getLink: ({ targetResource }) => `/sessions/${targetResource}`,
		type: "session",
	},

	[NotificationPayloadTypes.SESSION_REMINDER]: {
		getTitle: () => "Session reminder",
		getContent: ({ time }) => `You have a session tomorrow at ${time}`,
		getLink: ({ targetResource }) => `/sessions/${targetResource}`,
		type: "session",
	},

	[NotificationPayloadTypes.SESSION_COMMENCE_REMINDER]: {
		getTitle: () => "Session starting soon",
		getContent: ({ time }) => `Your session commences in ${time}`,
		getLink: ({ targetResource }) => `/sessions/${targetResource}`,
		type: "session",
	},

	/** CONNECTION RELATED */
	[NotificationPayloadTypes.USER_FOLLOWED]: {
		getTitle: () => "New follower",
		getContent: ({ triggeredBy }) => `${triggeredBy} followed you`,
		getLink: ({ targetResource }) => `/user/${targetResource}`,
		type: "connection",
	},
};
