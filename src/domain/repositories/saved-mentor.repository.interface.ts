import type { SavedMentor } from "../entities/saved-mentor.entity";
import type { CreatableRepository } from "./capabilities/creatable.repository.interface";
import type { MentorDiscoveryDetails } from "./mentor.repository.types";

export interface ISavedMentorRepository
	extends CreatableRepository<SavedMentor> {
	findByUserMentorList(
		userId: string,
		mentorId: string,
		listId: string,
	): Promise<SavedMentor | null>;
	findMentorsByListId(
		userId: string,
		listId: string,
	): Promise<MentorDiscoveryDetails[]>;
	countByListId(listId: string): Promise<number>;
	deleteByUserMentorList(
		userId: string,
		mentorId: string,
		listId: string,
	): Promise<void>;
	deleteByListId(listId: string): Promise<void>;
}
