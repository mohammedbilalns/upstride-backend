import type { MentorList } from "../entities/mentor-list.entity";
import type { CreatableRepository } from "./capabilities/creatable.repository.interface";
import type { FindByIdRepository } from "./capabilities/find-by-id.repository.interface";

export interface IMentorListRepository
	extends CreatableRepository<MentorList>,
		FindByIdRepository<MentorList> {
	findAllByUserId(userId: string): Promise<MentorList[]>;
	findByIdAndUserId(id: string, userId: string): Promise<MentorList | null>;
	countByUserId(userId: string): Promise<number>;
	deleteByIdAndUserId(id: string, userId: string): Promise<void>;
}
