import { fetchProfileResponseDto } from "../../../application/dtos/profile.dto";

export interface IFetchProfileUC {
	execute(userId: string): Promise<fetchProfileResponseDto>;
}
