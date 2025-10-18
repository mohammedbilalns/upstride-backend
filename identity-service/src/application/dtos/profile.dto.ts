import { Mentor, User } from "../../domain/entities";


export interface changePasswordDto {
	oldPassword: string;
	newPassword: string;
}
export type  updateProfileDto =  Partial<User> & {
	mentor?: Partial<Mentor>;
}; 


export type fetchProfileResponseDto = Partial<User & Mentor>;
