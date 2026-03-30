import { EntityValidationError } from "../errors";
import { MAX_LISTS_PER_USER, MAX_MENTORS_PER_LIST } from "./mentor.entity";

export class MentorList {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly name: string,
		public readonly description: string | null,
		public readonly createdAt: Date = new Date(),
		public readonly updatedAt: Date = new Date(),
	) {}

	static assertCanCreate(listCount: number): void {
		if (listCount >= MAX_LISTS_PER_USER) {
			throw new EntityValidationError(
				"MentorList",
				`Maximum of ${MAX_LISTS_PER_USER} lists per user is allowed.`,
			);
		}
	}

	static assertCanAddMentor(mentorCount: number): void {
		if (mentorCount >= MAX_MENTORS_PER_LIST) {
			throw new EntityValidationError(
				"MentorList",
				`Maximum of ${MAX_MENTORS_PER_LIST} mentors per list is allowed.`,
			);
		}
	}
}
