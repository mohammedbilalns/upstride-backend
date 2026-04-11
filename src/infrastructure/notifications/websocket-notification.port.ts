import { inject, injectable } from "inversify";
import type { NotificationPort } from "../../application/ports/notification.port";
import type { WebSocketServer } from "../../presentation/websocket/socket-server";
import { TYPES } from "../../shared/types/types";

@injectable()
export class WebSocketNotificationPort implements NotificationPort {
	constructor(
		@inject(TYPES.Services.WebSocketServer)
		private readonly _wsServer: WebSocketServer,
	) {}

	emitToUser(userId: string, event: string, payload: unknown): void {
		this._wsServer.emitToUser(userId, event, payload);
	}
}
