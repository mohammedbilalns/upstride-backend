export interface UpdateProfileInput {
	userId: string;
	name?: string;
	profilePictureId?: string;
	interests?: string[];
	skills?: string[];
}

export interface UpdateProfileOutput {
	success: boolean;
	message: string;
}
