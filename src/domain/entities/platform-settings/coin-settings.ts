import { freezeArray } from "../../../shared/utilities/freeze-array.util";
import { EntityValidationError } from "../../errors/entity-validation.error";
import type { SubscriptionType } from "./shared";

export class PurchaseRate {
	public readonly price: number;

	public readonly coinsCount: number;

	constructor(price: number, coinsCount: number) {
		if (price <= 0 || coinsCount <= 0) {
			throw new EntityValidationError(
				"PurchaseRate",
				"price and coins count must be greater than 0",
			);
		}

		if (price > coinsCount) {
			throw new EntityValidationError(
				"PurchaseRate",
				"price must be less than or equal to coins count",
			);
		}

		this.price = price;
		this.coinsCount = coinsCount;
		Object.freeze(this);
	}
}

export class PayoutRate {
	public readonly coinsCountFrom: number;

	public readonly coinsCountTo: number;

	public readonly payoutPerCoinRate: number;

	constructor(
		coinsCountFrom: number,
		coinsCountTo: number,
		payoutPerCoinRate: number,
	) {
		if (coinsCountFrom <= 0 || coinsCountTo <= 0) {
			throw new EntityValidationError(
				"PayoutRate",
				"coins count from and coins count to must be greater than 0",
			);
		}

		if (coinsCountTo <= coinsCountFrom) {
			throw new EntityValidationError(
				"PayoutRate",
				"coins count to must be greater than coins count from",
			);
		}

		this.coinsCountFrom = coinsCountFrom;
		this.coinsCountTo = coinsCountTo;
		this.payoutPerCoinRate = payoutPerCoinRate;
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
	public readonly purchaseRates: readonly PurchaseRate[];

	public readonly payoutRates: readonly PayoutRate[];

	public readonly subscriptions: readonly SubscriptionPlan[];

	public readonly userJoinRewardCoinCount: number;

	public readonly maxCoinsEarnablePerDay: number;

	public readonly maxCoinsFromReadingPerDay: number;

	public readonly maxCoinsFromEngagementPerDay: number;

	constructor(
		purchaseRates: readonly PurchaseRate[],
		payoutRates: readonly PayoutRate[],
		subscriptions: readonly SubscriptionPlan[],
		userJoinRewardCoinCount: number,
		maxCoinsEarnablePerDay: number,
		maxCoinsFromReadingPerDay: number,
		maxCoinsFromEngagementPerDay: number,
	) {
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

		if (
			purchaseRates.length <= 0 ||
			payoutRates.length <= 0 ||
			subscriptions.length <= 0
		) {
			throw new EntityValidationError(
				"EconomySettings",
				"purchase rates, payout rates, and subscriptions must have at least one element",
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

		const sortedPurchaseRates = [...purchaseRates].sort((a, b) => {
			if (a.price !== b.price) return a.price - b.price;
			return a.coinsCount - b.coinsCount;
		});

		const sortedPayoutRates = [...payoutRates].sort((a, b) => {
			if (a.coinsCountFrom !== b.coinsCountFrom) {
				return a.coinsCountFrom - b.coinsCountFrom;
			}
			return a.coinsCountTo - b.coinsCountTo;
		});

		for (let i = 1; i < sortedPurchaseRates.length; i += 1) {
			const prev = sortedPurchaseRates[i - 1];
			const curr = sortedPurchaseRates[i];

			if (curr.price <= prev.price) {
				throw new EntityValidationError(
					"PurchaseRate",
					"price must be strictly increasing with higher price tiers",
				);
			}

			if (curr.coinsCount <= prev.coinsCount) {
				throw new EntityValidationError(
					"PurchaseRate",
					"coins count must be strictly increasing with higher price tiers",
				);
			}
		}

		for (let i = 1; i < sortedPayoutRates.length; i += 1) {
			const prev = sortedPayoutRates[i - 1];
			const curr = sortedPayoutRates[i];

			if (curr.coinsCountFrom <= prev.coinsCountFrom) {
				throw new EntityValidationError(
					"PayoutRate",
					"coins count from must be strictly increasing",
				);
			}

			if (curr.coinsCountTo <= prev.coinsCountTo) {
				throw new EntityValidationError(
					"PayoutRate",
					"coins count to must be strictly increasing",
				);
			}

			if (curr.coinsCountFrom <= prev.coinsCountTo) {
				throw new EntityValidationError(
					"PayoutRate",
					"coins count ranges must not overlap",
				);
			}

			if (curr.payoutPerCoinRate < prev.payoutPerCoinRate) {
				throw new EntityValidationError(
					"PayoutRate",
					"payout per coin rate must be non-decreasing for higher coin ranges",
				);
			}
		}

		this.purchaseRates = freezeArray(sortedPurchaseRates);
		this.payoutRates = freezeArray(sortedPayoutRates);
		this.subscriptions = freezeArray(subscriptions);
		this.userJoinRewardCoinCount = userJoinRewardCoinCount;
		this.maxCoinsEarnablePerDay = maxCoinsEarnablePerDay;
		this.maxCoinsFromReadingPerDay = maxCoinsFromReadingPerDay;
		this.maxCoinsFromEngagementPerDay = maxCoinsFromEngagementPerDay;
		Object.freeze(this);
	}
}
