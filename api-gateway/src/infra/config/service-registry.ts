import env from "./env";

export enum ServiceName {
	ARTICLE = "article service",
	IDENTITY = "identity service",
	MEDIA = "media service",
	NOTIFICATION = "notification service",
	SESSIONS = "sessions service",
	CHAT = "chat service",
	PAYMENT = "payment service",
}

export const SERVICE_URL: Record<ServiceName, string> = {
	[ServiceName.ARTICLE]: env.ARTICLE_SERVICE_URL,
	[ServiceName.IDENTITY]: env.IDENTITY_SERVICE_URL,
	[ServiceName.MEDIA]: env.MEDIA_SERVICE_URL,
	[ServiceName.NOTIFICATION]: env.NOTIFICATION_SERVICE_URL,
	[ServiceName.SESSIONS]: env.SESSIONS_SERVICE_URL,
	[ServiceName.CHAT]: env.CHAT_SERVICE_URL,
	[ServiceName.PAYMENT]: env.PAYMENT_SERVICE_URL,
};
