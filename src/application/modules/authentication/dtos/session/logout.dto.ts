export interface LogoutInput {
	sessionId: string;
}

export interface RevokeSessionInput {
	requesterUserId: string;
	targetSessionId: string;
}

export interface RevokeAllOtherSessionsInput {
	requesterUserId: string;
	requesterSessionId: string;
}
