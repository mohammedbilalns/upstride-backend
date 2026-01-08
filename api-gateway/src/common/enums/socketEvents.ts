export enum SocketEvents {
	NEW_NOTIFICATION = "notification.new",
	SEND_MESSAGE = "send.message",
	MARK_MESSAGE_READ = "markread.message",
	MARKED_MESSAGE_READ = "markedread.message",
	MARK_CHAT_READ = "markread.chat",
	MARKED_CHAT_READ = "markedread.chat",
	// WebRTC
	JOIN_ROOM = "join_room",
	OFFER = "offer",
	ANSWER = "answer",
	ICE_CANDIDATE = "ice_candidate",
	LIVE_SESSION_MESSAGE = "live_message",
	MEDIA_STATUS = "media_status",
}
