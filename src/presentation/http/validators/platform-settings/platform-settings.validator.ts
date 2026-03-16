import { z } from "zod";
import {
	nonNegativeIntSchema,
	percentageSchema,
	positiveIntSchema,
} from "../../../../shared/validators";

const positiveNumberSchema = z
	.number()
	.positive("Value must be greater than 0");

const nonNegativeNumberSchema = z.number().min(0, "Value must be at least 0");

const purchaseRateSchema = z
	.object({
		price: positiveNumberSchema,
		coinsCount: positiveIntSchema,
	})
	.refine((rate) => rate.price <= rate.coinsCount, {
		message: "price must be less than or equal to coins count",
		path: ["price"],
	});

const payoutRateSchema = z
	.object({
		coinsCountFrom: positiveIntSchema,
		coinsCountTo: positiveIntSchema,
		payoutPerCoinRate: nonNegativeNumberSchema,
	})
	.refine((rate) => rate.coinsCountTo > rate.coinsCountFrom, {
		message: "coinsCountTo must be greater than coinsCountFrom",
		path: ["coinsCountTo"],
	});

const subscriptionPlanSchema = z.object({
	id: z.string().min(1, "Subscription id is required"),
	coinsCost: positiveIntSchema,
	type: z.enum(["monthly", "quarterly", "yearly"]),
});

export const updateEconomySettingsBodySchema = z
	.object({
		economy: z.object({
			purchaseRates: z.array(purchaseRateSchema).min(1),
			payoutRates: z.array(payoutRateSchema).min(1),
			subscriptions: z.array(subscriptionPlanSchema).min(1),
			userJoinRewardCoinCount: nonNegativeIntSchema,
			maxCoinsEarnablePerDay: nonNegativeIntSchema,
			maxCoinsFromReadingPerDay: nonNegativeIntSchema,
			maxCoinsFromEngagementPerDay: nonNegativeIntSchema,
		}),
	})
	.refine(
		(input) => {
			const sortedPurchaseRates = [...input.economy.purchaseRates].sort(
				(a, b) => {
					if (a.price !== b.price) return a.price - b.price;
					return a.coinsCount - b.coinsCount;
				},
			);

			for (let i = 1; i < sortedPurchaseRates.length; i += 1) {
				const prev = sortedPurchaseRates[i - 1];
				const curr = sortedPurchaseRates[i];

				if (curr.price <= prev.price) return false;
				if (curr.coinsCount <= prev.coinsCount) return false;
			}

			return true;
		},
		{
			message:
				"purchase rates must have strictly increasing prices and coin counts",
			path: ["economy", "purchaseRates"],
		},
	)
	.refine(
		(input) => {
			const sortedPayoutRates = [...input.economy.payoutRates].sort((a, b) => {
				if (a.coinsCountFrom !== b.coinsCountFrom) {
					return a.coinsCountFrom - b.coinsCountFrom;
				}
				return a.coinsCountTo - b.coinsCountTo;
			});

			for (let i = 1; i < sortedPayoutRates.length; i += 1) {
				const prev = sortedPayoutRates[i - 1];
				const curr = sortedPayoutRates[i];

				if (curr.coinsCountFrom <= prev.coinsCountFrom) return false;
				if (curr.coinsCountTo <= prev.coinsCountTo) return false;
				if (curr.coinsCountFrom <= prev.coinsCountTo) return false;
				if (curr.payoutPerCoinRate < prev.payoutPerCoinRate) return false;
			}

			return true;
		},
		{
			message:
				"payout rates must be ordered, non-overlapping, and non-decreasing",
			path: ["economy", "payoutRates"],
		},
	)
	.refine(
		(input) =>
			input.economy.maxCoinsFromReadingPerDay <=
				input.economy.maxCoinsEarnablePerDay &&
			input.economy.maxCoinsFromEngagementPerDay <=
				input.economy.maxCoinsEarnablePerDay,
		{
			message:
				"Max coins from reading/engagement cannot exceed max coins earnable per day",
			path: ["economy"],
		},
	)
	.refine(
		(input) => {
			const subscriptionIds = new Set(
				input.economy.subscriptions.map((plan) => plan.id),
			);
			const subscriptionTypes = new Set(
				input.economy.subscriptions.map((plan) => plan.type),
			);
			return (
				subscriptionIds.size === input.economy.subscriptions.length &&
				subscriptionTypes.size === input.economy.subscriptions.length
			);
		},
		{
			message: "Subscription ids and types must be unique",
			path: ["economy", "subscriptions"],
		},
	);

const mentorTierSchema = z
	.object({
		id: z.string().trim().min(1, "Tier id is required"),
		name: z.string().trim().min(1, "Tier name is required"),
		rateForThirtyMinSession: nonNegativeIntSchema,
		rateForSixtyMinSession: nonNegativeIntSchema,
		minFreeArticlesPercentage: percentageSchema,
		maxArticlesPerWeek: nonNegativeIntSchema,
		minSessionCompleted: nonNegativeIntSchema,
		minArticlesPublished: nonNegativeIntSchema,
	})
	.refine(
		(tier) => tier.rateForSixtyMinSession >= tier.rateForThirtyMinSession,
		{
			message:
				"60 minute session rate cannot be less than 30 minute session rate",
			path: ["rateForSixtyMinSession"],
		},
	);

export const updateMentorSettingsBodySchema = z
	.object({
		mentors: z.object({
			tiers: z.array(mentorTierSchema).min(1),
		}),
	})
	.refine(
		(input) => {
			const ids = new Set(input.mentors.tiers.map((tier) => tier.id));
			return ids.size === input.mentors.tiers.length;
		},
		{
			message: "Tier ids must be unique",
			path: ["mentors", "tiers"],
		},
	)
	.refine(
		(input) => {
			const sortedTiers = [...input.mentors.tiers].sort((a, b) => {
				if (a.minSessionCompleted !== b.minSessionCompleted) {
					return a.minSessionCompleted - b.minSessionCompleted;
				}
				if (a.minArticlesPublished !== b.minArticlesPublished) {
					return a.minArticlesPublished - b.minArticlesPublished;
				}
				return a.rateForThirtyMinSession - b.rateForThirtyMinSession;
			});

			for (let i = 1; i < sortedTiers.length; i += 1) {
				const prev = sortedTiers[i - 1];
				const curr = sortedTiers[i];

				if (curr.minSessionCompleted < prev.minSessionCompleted) {
					return false;
				}

				if (curr.minArticlesPublished < prev.minArticlesPublished) {
					return false;
				}
			}

			return true;
		},
		{
			message:
				"min session completed and min articles published must be non-decreasing across tiers",
			path: ["mentors", "tiers"],
		},
	);

export const updateContentSettingsBodySchema = z.object({
	content: z.object({
		premiumArticleRequirement: z.object({
			minFreeArticlesNewUserShouldHave: nonNegativeIntSchema.max(
				1_000,
				"min free articles for new users is unrealistically high",
			),
			minArticleViews: nonNegativeIntSchema.max(
				1_000_000,
				"min article views is unrealistically high",
			),
			minLikes: nonNegativeIntSchema.max(
				100_000,
				"min likes is unrealistically high",
			),
		}),
		feed: z.object({
			trendingWindowHours: nonNegativeIntSchema.max(
				720,
				"trending window hours is unrealistically high",
			),
			minimumEngagementForTrending: nonNegativeIntSchema.max(
				1_000_000,
				"minimum engagement for trending is unrealistically high",
			),
			articleDecayRate: nonNegativeNumberSchema.max(
				10,
				"article decay rate is unrealistically high",
			),
		}),
	}),
});

export const updateSessionSettingsBodySchema = z
	.object({
		sessions: z.object({
			cancellationWindowHours: positiveIntSchema,
			rescheduleWindowHours: nonNegativeIntSchema,
			maxSessionsPerDayPerMentor: positiveIntSchema,
			platformFeePercentage: percentageSchema,
		}),
	})
	.refine(
		(input) =>
			input.sessions.cancellationWindowHours >=
			input.sessions.rescheduleWindowHours,
		{
			message: "Cancellation window cannot be less than reschedule window",
			path: ["sessions", "cancellationWindowHours"],
		},
	);
