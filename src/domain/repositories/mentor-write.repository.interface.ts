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
	updateIsUserBlockedStatusByUserId(
		userId: string,
		isUserBlocked: boolean,
	): Promise<void>;
	recordCompletedSession(mentorId: string, completedAt: Date): Promise<void>;
}
