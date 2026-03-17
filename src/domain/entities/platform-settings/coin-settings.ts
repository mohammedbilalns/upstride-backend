import { freezeArray } from "../../../shared/utilities/freeze-array.util";
import { EntityValidationError } from "../../errors/entity-validation.error";
import type { SubscriptionType } from "./shared";

export class PlatformCommissions {
	public readonly sessionPercentage: number;

	public readonly userTipRewardPercentage: number;

	constructor(sessionPercentage: number, userTipRewardPercentage: number) {
		if (sessionPercentage < 0 || sessionPercentage > 100) {
			throw new EntityValidationError(
				"PlatformCommissions",
				"session percentage must be between 0 and 100",
			);
		}

		if (userTipRewardPercentage < 0 || userTipRewardPercentage > 100) {
			throw new EntityValidationError(
				"PlatformCommissions",
				"user tip/reward percentage must be between 0 and 100",
			);
		}

		this.sessionPercentage = sessionPercentage;
		this.userTipRewardPercentage = userTipRewardPercentage;
		Object.freeze(this);
	}
}

export class SubscriptionPlan {
	public readonly id: string;

	public readonly coinsCost: number;

	public readonly type: SubscriptionType;

	constructor(id: string, coinsCost: number, type: SubscriptionType) {
		if (coinsCost <= 0) {
			throw new EntityValidationError(
				"SubscriptionPlan",
				"coins cost must be greater than 0",
			);
		}

		this.id = id;
		this.coinsCost = coinsCost;
		this.type = type;
		Object.freeze(this);
	}
}

export class EconomySettings {
	public readonly coinValue: number;

	public readonly platformCommissions: PlatformCommissions;

	public readonly subscriptions: readonly SubscriptionPlan[];

	public readonly userJoinRewardCoinCount: number;

	public readonly maxCoinsEarnablePerDay: number;

	public readonly maxCoinsFromReadingPerDay: number;

	public readonly maxCoinsFromEngagementPerDay: number;

	constructor(
		coinValue: number,
		platformCommissions: PlatformCommissions,
		subscriptions: readonly SubscriptionPlan[],
		userJoinRewardCoinCount: number,
		maxCoinsEarnablePerDay: number,
		maxCoinsFromReadingPerDay: number,
		maxCoinsFromEngagementPerDay: number,
	) {
		if (coinValue <= 0) {
			throw new EntityValidationError(
				"EconomySettings",
				"coin value must be greater than 0",
			);
		}

		if (
			userJoinRewardCoinCount <= 0 ||
			maxCoinsEarnablePerDay <= 0 ||
			maxCoinsFromReadingPerDay <= 0 ||
			maxCoinsFromEngagementPerDay <= 0
		) {
			throw new EntityValidationError(
				"EconomySettings",
				"user join reward coin count, max coins earnable per day, max coins from reading per day, and max coins from engagement per day must be greater than 0",
			);
		}

		if (subscriptions.length <= 0) {
			throw new EntityValidationError(
				"EconomySettings",
				"subscriptions must have at least one element",
			);
		}

		if (maxCoinsFromReadingPerDay > maxCoinsEarnablePerDay) {
			throw new EntityValidationError(
				"EconomySettings",
				"max coins from reading per day cannot exceed max coins earnable per day",
			);
		}

		if (maxCoinsFromEngagementPerDay > maxCoinsEarnablePerDay) {
			throw new EntityValidationError(
				"EconomySettings",
				"max coins from engagement per day cannot exceed max coins earnable per day",
			);
		}

		const subscriptionIds = new Set(subscriptions.map((plan) => plan.id));
		if (subscriptionIds.size !== subscriptions.length) {
			throw new EntityValidationError(
				"EconomySettings",
				"subscription ids must be unique",
			);
		}

		const subscriptionTypes = new Set(subscriptions.map((plan) => plan.type));
		if (subscriptionTypes.size !== subscriptions.length) {
			throw new EntityValidationError(
				"EconomySettings",
				"subscription types must be unique",
			);
		}

		this.coinValue = coinValue;
		this.platformCommissions = platformCommissions;
		this.subscriptions = freezeArray(subscriptions);
		this.userJoinRewardCoinCount = userJoinRewardCoinCount;
		this.maxCoinsEarnablePerDay = maxCoinsEarnablePerDay;
		this.maxCoinsFromReadingPerDay = maxCoinsFromReadingPerDay;
		this.maxCoinsFromEngagementPerDay = maxCoinsFromEngagementPerDay;
		Object.freeze(this);
	}
}
