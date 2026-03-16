import { freezeArray } from "../../../shared/utilities/freeze-array.util";
import { EntityValidationError } from "../../errors/entity-validation.error";

export class MentorTier {
	public readonly id: string;

	public readonly name: string;

	public readonly rateForThirtyMinSession: number;

	public readonly rateForSixtyMinSession: number;

	public readonly minFreeArticlesPercentage: number;

	public readonly maxArticlesPerWeek: number;

	public readonly minSessionCompleted: number;

	public readonly minArticlesPublished: number;

	constructor(
		id: string,
		name: string,
		rateForThirtyMinSession: number,
		rateForSixtyMinSession: number,
		minFreeArticlesPercentage: number,
		maxArticlesPerWeek: number,
		minSessionCompleted: number,
		minArticlesPublished: number,
	) {
		if (
			rateForThirtyMinSession < 0 ||
			rateForSixtyMinSession < 0 ||
			minFreeArticlesPercentage < 0 ||
			maxArticlesPerWeek < 0 ||
			minSessionCompleted < 0 ||
			minArticlesPublished < 0
		) {
			throw new EntityValidationError(
				"MentorTier",
				"rates, percentages, and requirements must be non-negative",
			);
		}

		if (minFreeArticlesPercentage > 100) {
			throw new EntityValidationError(
				"MentorTier",
				"min free articles percentage must be between 0 and 100",
			);
		}

		if (!id.trim()) {
			throw new EntityValidationError("MentorTier", "id is required");
		}

		if (!name.trim()) {
			throw new EntityValidationError("MentorTier", "name is required");
		}

		if (rateForSixtyMinSession < rateForThirtyMinSession) {
			throw new EntityValidationError(
				"MentorTier",
				"60 minute session rate cannot be less than 30 minute session rate",
			);
		}

		this.id = id;
		this.name = name;
		this.rateForThirtyMinSession = rateForThirtyMinSession;
		this.rateForSixtyMinSession = rateForSixtyMinSession;
		this.minFreeArticlesPercentage = minFreeArticlesPercentage;
		this.maxArticlesPerWeek = maxArticlesPerWeek;
		this.minSessionCompleted = minSessionCompleted;
		this.minArticlesPublished = minArticlesPublished;
		Object.freeze(this);
	}
}

export class MentorSettings {
	public readonly tiers: readonly MentorTier[];

	constructor(tiers: readonly MentorTier[]) {
		const sortedTiers = [...tiers].sort((a, b) => {
			if (a.minSessionCompleted !== b.minSessionCompleted) {
				return a.minSessionCompleted - b.minSessionCompleted;
			}
			if (a.minArticlesPublished !== b.minArticlesPublished) {
				return a.minArticlesPublished - b.minArticlesPublished;
			}
			return a.rateForThirtyMinSession - b.rateForThirtyMinSession;
		});

		const tierIds = new Set(sortedTiers.map((tier) => tier.id));
		if (tierIds.size !== sortedTiers.length) {
			throw new EntityValidationError(
				"MentorSettings",
				"tier ids must be unique",
			);
		}

		for (let i = 1; i < sortedTiers.length; i += 1) {
			const prev = sortedTiers[i - 1];
			const curr = sortedTiers[i];

			if (curr.minSessionCompleted < prev.minSessionCompleted) {
				throw new EntityValidationError(
					"MentorSettings",
					"min session completed must be non-decreasing across tiers",
				);
			}

			if (curr.minArticlesPublished < prev.minArticlesPublished) {
				throw new EntityValidationError(
					"MentorSettings",
					"min articles published must be non-decreasing across tiers",
				);
			}
		}

		this.tiers = freezeArray(sortedTiers);
		Object.freeze(this);
	}
}
