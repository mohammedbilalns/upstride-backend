import type { Mentor, User } from "../../domain/entities";

export interface changePasswordDto {
	oldPassword: string;
	newPassword: string;
}
export type updateProfileDto = {
	id: string;
	name?: string;
	profilePicture?: {
		public_id: string;
		original_filename: string;
		resource_type: string;
		secure_url: string;
		bytes: number;
		asset_folder: string;
	};
	interestedExpertises?: string[];
	interestedSkills?: string[];
};

export type fetchProfileResponseDto = Partial<User & Mentor>;
