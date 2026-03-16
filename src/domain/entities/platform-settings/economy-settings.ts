import { freezeArray } from "../../../shared/utilities/freeze-array.util";
import { EntityValidationError } from "../../errors/entity-validation.error";
import type { SubscriptionType } from "./shared";

export class PurchaseRate {
	public readonly price: number;

	public readonly coinsCount: number;

	constructor(price: number, coinsCount: number) {
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

	public readonly platformCommissionPercentage: number;

	constructor(
		purchaseRates: readonly PurchaseRate[],
		payoutRates: readonly PayoutRate[],
		subscriptions: readonly SubscriptionPlan[],
		userJoinRewardCoinCount: number,
		maxCoinsEarnablePerDay: number,
		maxCoinsFromReadingPerDay: number,
		maxCoinsFromEngagementPerDay: number,
		platformCommissionPercentage: number,
	) {
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

		this.purchaseRates = freezeArray(purchaseRates);
		this.payoutRates = freezeArray(payoutRates);
		this.subscriptions = freezeArray(subscriptions);
		this.userJoinRewardCoinCount = userJoinRewardCoinCount;
		this.maxCoinsEarnablePerDay = maxCoinsEarnablePerDay;
		this.maxCoinsFromReadingPerDay = maxCoinsFromReadingPerDay;
		this.maxCoinsFromEngagementPerDay = maxCoinsFromEngagementPerDay;
		this.platformCommissionPercentage = platformCommissionPercentage;
		Object.freeze(this);
	}
}
