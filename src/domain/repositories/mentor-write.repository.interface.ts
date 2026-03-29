import type { Mentor } from "../entities/mentor.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface IMentorWriteRepository
	extends FindByIdRepository<Mentor>,
		CreatableRepository<Mentor>,
		UpdatableByIdRepository<Mentor> {
	findByUserId(userId: string): Promise<Mentor | null>;
	updateStatus(
		id: string,
		isApproved: boolean,
		rejectionReason?: string | null,
	): Promise<Mentor | null>;
	updateIsUserBlockedStatusByUserId(
		userId: string,
		isUserBlocked: boolean,
	): Promise<void>;
}
