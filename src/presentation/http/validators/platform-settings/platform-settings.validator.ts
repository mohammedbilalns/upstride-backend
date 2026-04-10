import { z } from "zod";
import {
	nonNegativeIntSchema,
	percentageSchema,
	positiveIntSchema,
} from "../../../../shared/validators";

const PositiveNumberSchema = z
	.number()
	.positive("Value must be greater than 0");

const PlatformCommissionsSchema = z.object({
	sessionPercentage: percentageSchema,
	userTipRewardPercentage: percentageSchema,
});

const SubscriptionPlanSchema = z.object({
	id: z.string().min(1, "Subscription id is required"),
	coinsCost: positiveIntSchema,
	type: z.enum(["monthly", "quarterly", "yearly"]),
});

export const UpdateEconomySettingsBodySchema = z
	.object({
		economy: z.object({
			coinValue: PositiveNumberSchema,
			platformCommissions: PlatformCommissionsSchema,
			subscriptions: z.array(SubscriptionPlanSchema).min(1),
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
export type UpdateEconomySettingsBody = z.infer<
	typeof UpdateEconomySettingsBodySchema
>;

const MentorTierSchema = z.object({
	level: z.number().int().min(1).max(3),
	name: z.string().trim().min(1, "Tier name is required"),
	minScore: nonNegativeIntSchema.max(100, "min score must be at most 100"),
	maxScore: nonNegativeIntSchema.max(100, "max score must be at most 100"),
	maxPricePer30Min: nonNegativeIntSchema
		.min(100, "max price per 30 min must be at least 100")
		.max(10000, "max price per 30 min must be at most 10000"),
});

export const UpdateMentorSettingsBodySchema = z
	.object({
		mentors: z.object({
			starter: MentorTierSchema,
			rising: MentorTierSchema,
			expert: MentorTierSchema,
		}),
	})
	.refine(
		(input) =>
			input.mentors.starter.level === 1 &&
			input.mentors.rising.level === 2 &&
			input.mentors.expert.level === 3,
		{
			message: "Mentor tier levels must be Starter(1), Rising(2), Expert(3)",
			path: ["mentors"],
		},
	)
	.refine(
		(input) => {
			const names = new Set([
				input.mentors.starter.name,
				input.mentors.rising.name,
				input.mentors.expert.name,
			]);
			return names.size === 3;
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
			];

			for (const tier of tiers) {
				if (tier.maxScore <= tier.minScore) {
					return false;
				}
			}

			for (let i = 1; i < tiers.length; i += 1) {
				const prev = tiers[i - 1];
				const curr = tiers[i];

				if (curr.maxPricePer30Min <= prev.maxPricePer30Min) {
					return false;
				}

				if (curr.minScore < prev.maxScore) {
					return false;
				}

				if (curr.maxScore <= prev.maxScore) {
					return false;
				}
			}

			return true;
		},
		{
			message: "Mentor tiers must be ordered for score ranges and max price",
			path: ["mentors"],
		},
	);
export type UpdateMentorSettingsBody = z.infer<
	typeof UpdateMentorSettingsBodySchema
>;

export const UpdateContentSettingsBodySchema = z.object({
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
export type UpdateContentSettingsBody = z.infer<
	typeof UpdateContentSettingsBodySchema
>;

export const UpdateSessionSettingsBodySchema = z.object({
	sessions: z.object({
		cancellationWindowHours: nonNegativeIntSchema,
		rescheduleWindowHours: nonNegativeIntSchema,
		maxSessionsPerDayPerMentor: positiveIntSchema,
	}),
});
export type UpdateSessionSettingsBody = z.infer<
	typeof UpdateSessionSettingsBodySchema
>;
