export interface PurchaseRateDto {
	price: number;
	coinsCount: number;
	revenuePercentage?: number;
}

export interface PayoutRateDto {
	coinsCountFrom: number;
	coinsCountTo: number;
	payoutPerCoinRate: number;
}

export interface SubscriptionPlanDto {
	id: string;
	coinsCost: number;
	type: "monthly" | "quarterly" | "yearly";
}

export interface EconomySettingsDto {
	purchaseRates: PurchaseRateDto[];
	payoutRates: PayoutRateDto[];
	subscriptions: SubscriptionPlanDto[];
	userJoinRewardCoinCount: number;
	maxCoinsEarnablePerDay: number;
	maxCoinsFromReadingPerDay: number;
	maxCoinsFromEngagementPerDay: number;
}

export interface MentorTierDto {
	id: string;
	name: string;
	rateForThirtyMinSession: number;
	rateForSixtyMinSession: number;
	minFreeArticlesPercentage: number;
	maxArticlesPerWeek: number;
	minSessionCompleted: number;
	minArticlesPublished: number;
}

export interface MentorSettingsDto {
	tiers: MentorTierDto[];
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
	platformFeePercentage: number;
}
