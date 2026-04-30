export interface JoinSessionInput {
	bookingId: string;
	userId: string;
}

export interface JoinSessionOutput {
	roomId: string;
	otherUserId: string;
	joinerName: string;
	joinerRole: string;
}
