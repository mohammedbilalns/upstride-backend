export class Skill {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly slug: string,
		public readonly interestId: string,
		public readonly isActive: boolean,
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date,
	) {}
}
