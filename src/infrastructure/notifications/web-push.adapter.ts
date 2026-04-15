import { injectable } from "inversify";
import webpush from "web-push";
import type { IPushNotificationPort as PushNotificationPort } from "../../application/services";
import env from "../../shared/config/env";

@injectable()
export class WebPushAdapter implements PushNotificationPort {
	constructor() {
		webpush.setVapidDetails(
			"mailto:support@upstride.com",
			env.VAPID_PUBLIC_KEY,
			env.VAPID_PRIVATE_KEY,
		);
	}

	async sendNotification(
		subscription: {
			endpoint: string;
			keys: { p256dh: string; auth: string };
		},
		payload: string,
	): Promise<void> {
		try {
			await webpush.sendNotification(subscription, payload);
		} catch (error: any) {
			if (error.statusCode === 404 || error.statusCode === 410) {
				throw new Error("SUBSCRIPTION_EXPIRED");
			}
			throw error;
		}
	}
}
