export interface WebRTCOfferPayload {
	bookingId: string;
	offer: RTCSessionDescriptionInit;
}

export interface WebRTCAnswerPayload {
	bookingId: string;
	answer: RTCSessionDescriptionInit;
}

export interface WebRTCIceCandidatePayload {
	bookingId: string;
	candidate: RTCIceCandidateInit;
}

export interface CallRoomJoinPayload {
	bookingId: string;
}

export interface ToggledMediaPayload {
	bookingId: string;
	mediaType: "camera" | "mic";
	isEnabled: boolean;
}

export interface WhiteboardSyncPayload {
	bookingId: string;
	update: any; // State vector or delta
}

export interface WhiteboardPermissionPayload {
	bookingId: string;
	menteeId: string;
	allow: boolean;
}

export interface CallEndPayload {
	bookingId: string;
}
