import type { Server, Socket } from "socket.io";
import type { SocketPublisher } from "../socket.publisher";

export function registerNotificationEvents(
	io: Server,
	socket: Socket,
	publisher: SocketPublisher,
) {
	console.log(io, socket, publisher);
}
