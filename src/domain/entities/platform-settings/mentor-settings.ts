import { EntityValidationError } from "../../errors/entity-validation.error";

export enum MentorTierLevel {
	Starter = 1,
	Rising = 2,
	Expert = 3,
	Elite = 4,
}

export class MentorTier {
	public readonly level: MentorTierLevel;

	public readonly name: string;

	public readonly rateForThirtyMinSession: number;

	public readonly minFreeArticlesPercentage: number;

	public readonly maxArticlesPerWeek: number;

	public readonly minSessionCompleted: number;

	public readonly minArticlesPublished: number;

	constructor(
		level: MentorTierLevel,
		name: string,
		rateForThirtyMinSession: number,
		minFreeArticlesPercentage: number,
		maxArticlesPerWeek: number,
		minSessionCompleted: number,
		minArticlesPublished: number,
	) {
		if (
			!name ||
			rateForThirtyMinSession < 0 ||
			minFreeArticlesPercentage < 0 ||
			maxArticlesPerWeek < 0 ||
			minSessionCompleted < 0 ||
			minArticlesPublished < 0
		) {
			throw new EntityValidationError(
				"MentorTier",
				"name, rate for 30 minute session, and minimums must be valid",
			);
		}

		if (minFreeArticlesPercentage > 100) {
			throw new EntityValidationError(
				"MentorTier",
				"min free articles percentage must be at most 100",
			);
		}

		this.level = level;
		this.name = name;
		this.rateForThirtyMinSession = rateForThirtyMinSession;
		this.minFreeArticlesPercentage = minFreeArticlesPercentage;
		this.maxArticlesPerWeek = maxArticlesPerWeek;
		this.minSessionCompleted = minSessionCompleted;
		this.minArticlesPublished = minArticlesPublished;
		Object.freeze(this);
	}
}

export class MentorSettings {
	public readonly starter: MentorTier;

	public readonly rising: MentorTier;

	public readonly expert: MentorTier;

	public readonly elite: MentorTier;

	constructor(
		starter: MentorTier,
		rising: MentorTier,
		expert: MentorTier,
		elite: MentorTier,
	) {
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

		if (elite.level !== MentorTierLevel.Elite) {
			throw new EntityValidationError(
				"MentorSettings",
				"elite tier level must be Elite",
			);
		}

		const names = new Set([starter.name, rising.name, expert.name, elite.name]);
		if (names.size !== 4) {
			throw new EntityValidationError(
				"MentorSettings",
				"tier names must be unique",
			);
		}

		const tiers = [starter, rising, expert, elite];

		for (let i = 1; i < tiers.length; i += 1) {
			const prev = tiers[i - 1];
			const curr = tiers[i];

			if (curr.rateForThirtyMinSession <= prev.rateForThirtyMinSession) {
				throw new EntityValidationError(
					"MentorSettings",
					"rate for 30 minute session must be strictly increasing",
				);
			}

			if (curr.maxArticlesPerWeek <= prev.maxArticlesPerWeek) {
				throw new EntityValidationError(
					"MentorSettings",
					"max articles per week must be strictly increasing",
				);
			}

			if (curr.minSessionCompleted <= prev.minSessionCompleted) {
				throw new EntityValidationError(
					"MentorSettings",
					"min session completed must be strictly increasing",
				);
			}

			if (curr.minArticlesPublished <= prev.minArticlesPublished) {
				throw new EntityValidationError(
					"MentorSettings",
					"min articles published must be strictly increasing",
				);
			}

			if (curr.minFreeArticlesPercentage >= prev.minFreeArticlesPercentage) {
				throw new EntityValidationError(
					"MentorSettings",
					"min free articles percentage must be strictly decreasing",
				);
			}
		}

		this.starter = starter;
		this.rising = rising;
		this.expert = expert;
		this.elite = elite;
		Object.freeze(this);
	}
}
