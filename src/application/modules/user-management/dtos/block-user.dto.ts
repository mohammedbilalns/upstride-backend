export interface BlockUserInput {
	userId: string;
	reportId?: string;
	reason?: string;
}

export interface UnblockUserInput {
	userId: string;
}
