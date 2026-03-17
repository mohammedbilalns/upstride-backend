import { z } from "zod";
import {
	nonNegativeIntSchema,
	percentageSchema,
	positiveIntSchema,
} from "../../../../shared/validators";

const positiveNumberSchema = z
	.number()
	.positive("Value must be greater than 0");

const platformCommissionsSchema = z.object({
	sessionPercentage: percentageSchema,
	userTipRewardPercentage: percentageSchema,
});

const subscriptionPlanSchema = z.object({
	id: z.string().min(1, "Subscription id is required"),
	coinsCost: positiveIntSchema,
	type: z.enum(["monthly", "quarterly", "yearly"]),
});

export const updateEconomySettingsBodySchema = z
	.object({
		economy: z.object({
			coinValue: positiveNumberSchema,
			platformCommissions: platformCommissionsSchema,
			subscriptions: z.array(subscriptionPlanSchema).min(1),
			userJoinRewardCoinCount: nonNegativeIntSchema,
			maxCoinsEarnablePerDay: nonNegativeIntSchema,
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

const mentorTierSchema = z.object({
	level: z.number().int().min(1).max(4),
	name: z.string().trim().min(1, "Tier name is required"),
	rateForThirtyMinSession: nonNegativeIntSchema,
	minFreeArticlesPercentage: percentageSchema,
	maxArticlesPerWeek: nonNegativeIntSchema,
	minSessionCompleted: nonNegativeIntSchema,
	minArticlesPublished: nonNegativeIntSchema,
});

export const updateMentorSettingsBodySchema = z
	.object({
		mentors: z.object({
			starter: mentorTierSchema,
			rising: mentorTierSchema,
			expert: mentorTierSchema,
			elite: mentorTierSchema,
		}),
	})
	.refine(
		(input) =>
			input.mentors.starter.level === 1 &&
			input.mentors.rising.level === 2 &&
			input.mentors.expert.level === 3 &&
			input.mentors.elite.level === 4,
		{
			message:
				"Mentor tier levels must be Starter(1), Rising(2), Expert(3), Elite(4)",
			path: ["mentors"],
		},
	)
	.refine(
		(input) => {
			const names = new Set([
				input.mentors.starter.name,
				input.mentors.rising.name,
				input.mentors.expert.name,
				input.mentors.elite.name,
			]);
			return names.size === 4;
		},
		{
			message: "Tier names must be unique",
			path: ["mentors"],
		},
	)
	.refine(
		(input) => {
			const tiers = [
				input.mentors.starter,
				input.mentors.rising,
				input.mentors.expert,
				input.mentors.elite,
			];

			for (let i = 1; i < tiers.length; i += 1) {
				const prev = tiers[i - 1];
				const curr = tiers[i];

				if (curr.rateForThirtyMinSession <= prev.rateForThirtyMinSession) {
					return false;
				}

				if (curr.maxArticlesPerWeek <= prev.maxArticlesPerWeek) {
					return false;
				}

				if (curr.minSessionCompleted <= prev.minSessionCompleted) {
					return false;
				}

				if (curr.minArticlesPublished <= prev.minArticlesPublished) {
					return false;
				}

				if (curr.minFreeArticlesPercentage >= prev.minFreeArticlesPercentage) {
					return false;
				}
			}

			return true;
		},
		{
			message:
				"Mentor tiers must be strictly ordered for rates, limits, minimums, and free-article percentage",
			path: ["mentors"],
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
			trendingWindowHours: positiveIntSchema.max(
				168,
				"trending window hours is unrealistically high",
			),
			minimumEngagementForTrending: nonNegativeIntSchema.max(
				1_000_000,
				"minimum engagement for trending is unrealistically high",
			),
			articleDecayRate: nonNegativeIntSchema.max(
				1,
				"article decay rate must be between 0 and 1",
			),
		}),
	}),
});

export const updateSessionSettingsBodySchema = z.object({
	sessions: z.object({
		cancellationWindowHours: nonNegativeIntSchema,
		rescheduleWindowHours: nonNegativeIntSchema,
		maxSessionsPerDayPerMentor: positiveIntSchema,
	}),
});
