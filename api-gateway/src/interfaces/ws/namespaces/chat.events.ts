
import { Server, Socket } from "socket.io";
import { SocketPublisher } from "../socket.publisher";

export function registerChatEvents(io:Server, socket:Socket, publisher: SocketPublisher){

	console.log(io, socket, publisher)

}
