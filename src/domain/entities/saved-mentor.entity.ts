export class SavedMentor {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly mentorId: string,
		public readonly listId: string,
		public readonly createdAt: Date = new Date(),
	) {}
}
