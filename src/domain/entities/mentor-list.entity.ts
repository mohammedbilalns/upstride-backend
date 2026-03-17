export class MentorList {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly name: string,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}
}
