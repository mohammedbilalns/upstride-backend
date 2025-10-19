import type {
	changePasswordDto,
	fetchProfileResponseDto,
	updateProfileDto,
} from "../../application/dtos/profile.dto";

export interface IProfileService {
	fetchProfileById(profileId: string): Promise<fetchProfileResponseDto>;
	updateProfile(userId: string, data: updateProfileDto): Promise<void>;
	changePassword(userId: string, data: changePasswordDto): Promise<void>;
}
