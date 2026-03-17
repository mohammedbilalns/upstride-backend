import { EntityValidationError } from "../../errors/entity-validation.error";

export enum MentorTierLevel {
	Starter = 1,
	Rising = 2,
	Expert = 3,
}

export class MentorTier {
	public readonly level: MentorTierLevel;

	public readonly name: string;

	public readonly minScore: number;

	public readonly maxScore: number;

	public readonly maxPricePer30Min: number;

	constructor(
		level: MentorTierLevel,
		name: string,
		minScore: number,
		maxScore: number,
		maxPricePer30Min: number,
	) {
		if (!name || minScore < 0 || maxScore < 0) {
			throw new EntityValidationError(
				"MentorTier",
				"name and scores must be valid",
			);
		}

		if (maxScore > 100 || minScore > 100) {
			throw new EntityValidationError(
				"MentorTier",
				"min/max score must be at most 100",
			);
		}

		if (maxScore <= minScore) {
			throw new EntityValidationError(
				"MentorTier",
				"max score must be greater than min score",
			);
		}

		if (maxPricePer30Min < 100 || maxPricePer30Min > 10000) {
			throw new EntityValidationError(
				"MentorTier",
				"max price per 30 min must be between 100 and 10000",
			);
		}

		this.level = level;
		this.name = name;
		this.minScore = minScore;
		this.maxScore = maxScore;
		this.maxPricePer30Min = maxPricePer30Min;
		Object.freeze(this);
	}
}

export class MentorSettings {
	public readonly starter: MentorTier;

	public readonly rising: MentorTier;

	public readonly expert: MentorTier;

	constructor(starter: MentorTier, rising: MentorTier, expert: MentorTier) {
		if (starter.level !== MentorTierLevel.Starter) {
			throw new EntityValidationError(
				"MentorSettings",
				"starter tier level must be Starter",
			);
		}

		if (rising.level !== MentorTierLevel.Rising) {
			throw new EntityValidationError(
				"MentorSettings",
				"rising tier level must be Rising",
			);
		}

		if (expert.level !== MentorTierLevel.Expert) {
			throw new EntityValidationError(
				"MentorSettings",
				"expert tier level must be Expert",
			);
		}

		const names = new Set([starter.name, rising.name, expert.name]);
		if (names.size !== 3) {
			throw new EntityValidationError(
				"MentorSettings",
				"tier names must be unique",
			);
		}

		const tiers = [starter, rising, expert];

		for (let i = 1; i < tiers.length; i += 1) {
			const prev = tiers[i - 1];
			const curr = tiers[i];

			if (curr.maxPricePer30Min <= prev.maxPricePer30Min) {
				throw new EntityValidationError(
					"MentorSettings",
					"higher tiers must have a strictly higher max price per 30 min",
				);
			}

			if (curr.minScore < prev.maxScore) {
				throw new EntityValidationError(
					"MentorSettings",
					"min score must be greater than or equal to previous max score",
				);
			}

			if (curr.maxScore <= prev.maxScore) {
				throw new EntityValidationError(
					"MentorSettings",
					"max score must be strictly increasing",
				);
			}
		}

		this.starter = starter;
		this.rising = rising;
		this.expert = expert;
		Object.freeze(this);
	}
}
