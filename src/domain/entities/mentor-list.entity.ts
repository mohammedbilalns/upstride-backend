export class MentorList {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly name: string,
		public readonly description: string | null,
		public readonly createdAt: Date = new Date(),
		public readonly updatedAt: Date = new Date(),
	) {}
}
