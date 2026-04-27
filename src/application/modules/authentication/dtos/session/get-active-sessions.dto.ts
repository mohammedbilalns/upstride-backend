export interface GetActiveSessionsInput {
	userId: string;
}

export interface ActiveSessionDTO {
	id: string;
	ip: string;
	deviceName: string;
	deviceType: string;
	lastUsedAt: Date;
	isCurrent: boolean;
}

export interface GetActiveSessionsResponse {
	sessions: ActiveSessionDTO[];
}
