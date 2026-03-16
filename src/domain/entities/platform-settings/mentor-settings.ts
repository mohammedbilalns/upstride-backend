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
		this.tiers = freezeArray(tiers);
		Object.freeze(this);
	}
}
