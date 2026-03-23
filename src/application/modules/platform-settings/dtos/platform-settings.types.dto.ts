import type { MentorTierLevel } from "../../../../domain/entities/platform-settings/mentor-settings";

export interface PlatformCommissionsDto {
	sessionPercentage: number;
	userTipRewardPercentage: number;
}

export interface SubscriptionPlanDto {
	id: string;
	coinsCost: number;
	type: "monthly" | "quarterly" | "yearly";
}

export interface EconomySettingsDto {
	coinValue: number;
	platformCommissions: PlatformCommissionsDto;
	subscriptions: SubscriptionPlanDto[];
	userJoinRewardCoinCount: number;
	maxCoinsEarnablePerDay: number;
	maxCoinsFromReadingPerDay: number;
	maxCoinsFromEngagementPerDay: number;
}

export interface MentorTierDto {
	level: MentorTierLevel;
	name: string;
	minScore: number;
	maxScore: number;
	maxPricePer30Min: number;
}

export interface MentorSettingsDto {
	starter: MentorTierDto;
	rising: MentorTierDto;
	expert: MentorTierDto;
}

export interface PremiumArticleRequirementDto {
	minFreeArticlesNewUserShouldHave: number;
	minArticleViews: number;
	minLikes: number;
}

export interface FeedSettingsDto {
	trendingWindowHours: number;
	minimumEngagementForTrending: number;
	articleDecayRate: number;
}

export interface ContentSettingsDto {
	premiumArticleRequirement: PremiumArticleRequirementDto;
	feed: FeedSettingsDto;
}

export interface SessionSettingsDto {
	cancellationWindowHours: number;
	rescheduleWindowHours: number;
	maxSessionsPerDayPerMentor: number;
}
