import { z } from "zod";
import {
	nonNegativeIntSchema,
	percentageSchema,
	positiveIntSchema,
} from "../../../../shared/validators";

const positiveNumberSchema = z
	.number()
	.positive("Value must be greater than 0");

const purchaseRateSchema = z.object({
	price: positiveNumberSchema,
	coinsCount: positiveIntSchema,
});

const payoutRateSchema = z
	.object({
		coinsCountFrom: nonNegativeIntSchema,
		coinsCountTo: positiveIntSchema,
		payoutPerCoinRate: positiveNumberSchema,
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
			maxCoinsEarnablePerDay: positiveIntSchema,
			maxCoinsFromReadingPerDay: nonNegativeIntSchema,
			maxCoinsFromEngagementPerDay: nonNegativeIntSchema,
		}),
	})
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
		id: z.string().min(1, "Tier id is required"),
		name: z.string().min(1, "Tier name is required"),
		rateForThirtyMinSession: positiveNumberSchema,
		rateForSixtyMinSession: positiveNumberSchema,
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

export const updateMentorSettingsBodySchema = z.object({
	mentors: z.object({
		tiers: z.array(mentorTierSchema).min(1),
	}),
});

export const updateContentSettingsBodySchema = z.object({
	content: z.object({
		premiumArticleRequirement: z.object({
			minFreeArticlesNewUserShouldHave: nonNegativeIntSchema,
			minArticleViews: nonNegativeIntSchema,
			minLikes: nonNegativeIntSchema,
		}),
		feed: z.object({
			trendingWindowHours: positiveIntSchema,
			minimumEngagementForTrending: nonNegativeIntSchema,
			articleDecayRate: positiveNumberSchema,
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
