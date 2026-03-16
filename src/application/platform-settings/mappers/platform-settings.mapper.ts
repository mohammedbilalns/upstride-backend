import type {
	ContentSettings,
	EconomySettings,
	MentorSettings,
	PlatformSettingsDataMap,
	SessionSettings,
} from "../../../domain/entities/platform-settings.entity";
import {
	ContentSettings as ContentSettingsEntity,
	EconomySettings as EconomySettingsEntity,
	FeedSettings as FeedSettingsEntity,
	MentorSettings as MentorSettingsEntity,
	MentorTier as MentorTierEntity,
	PayoutRate as PayoutRateEntity,
	PremiumArticleRequirement as PremiumArticleRequirementEntity,
	PurchaseRate as PurchaseRateEntity,
	SessionSettings as SessionSettingsEntity,
	SubscriptionPlan as SubscriptionPlanEntity,
} from "../../../domain/entities/platform-settings.entity";
import type { FetchPlatformSettingsResponse } from "../dtos/fetch-platform-settings.dto";
import type {
	ContentSettingsDto,
	EconomySettingsDto,
	MentorSettingsDto,
	SessionSettingsDto,
} from "../dtos/platform-settings.types.dto";

export class PlatformSettingsDtoMapper {
	static toFetchResponse(
		settings: PlatformSettingsDataMap,
	): FetchPlatformSettingsResponse {
		return {
			economy: PlatformSettingsDtoMapper.toEconomySettingsDto(settings.economy),
			mentors: PlatformSettingsDtoMapper.toMentorSettingsDto(settings.mentors),
			content: PlatformSettingsDtoMapper.toContentSettingsDto(settings.content),
			sessions: PlatformSettingsDtoMapper.toSessionSettingsDto(
				settings.sessions,
			),
		};
	}

	static toEconomySettingsDto(settings: EconomySettings): EconomySettingsDto {
		return {
			purchaseRates: settings.purchaseRates.map((rate) => ({
				price: rate.price,
				coinsCount: rate.coinsCount,
			})),
			payoutRates: settings.payoutRates.map((rate) => ({
				coinsCountFrom: rate.coinsCountFrom,
				coinsCountTo: rate.coinsCountTo,
				payoutPerCoinRate: rate.payoutPerCoinRate,
			})),
			subscriptions: settings.subscriptions.map((plan) => ({
				id: plan.id,
				coinsCost: plan.coinsCost,
				type: plan.type,
			})),
			userJoinRewardCoinCount: settings.userJoinRewardCoinCount,
			maxCoinsEarnablePerDay: settings.maxCoinsEarnablePerDay,
			maxCoinsFromReadingPerDay: settings.maxCoinsFromReadingPerDay,
			maxCoinsFromEngagementPerDay: settings.maxCoinsFromEngagementPerDay,
			platformCommissionPercentage: settings.platformCommissionPercentage,
		};
	}

	static toMentorSettingsDto(settings: MentorSettings): MentorSettingsDto {
		return {
			tiers: settings.tiers.map((tier) => ({
				id: tier.id,
				name: tier.name,
				rateForThirtyMinSession: tier.rateForThirtyMinSession,
				rateForSixtyMinSession: tier.rateForSixtyMinSession,
				minFreeArticlesPercentage: tier.minFreeArticlesPercentage,
				maxArticlesPerWeek: tier.maxArticlesPerWeek,
				minSessionCompleted: tier.minSessionCompleted,
				minArticlesPublished: tier.minArticlesPublished,
			})),
		};
	}

	static toContentSettingsDto(settings: ContentSettings): ContentSettingsDto {
		return {
			premiumArticleRequirement: {
				minFreeArticlesNewUserShouldHave:
					settings.premiumArticleRequirement.minFreeArticlesNewUserShouldHave,
				minArticleViews: settings.premiumArticleRequirement.minArticleViews,
				minLikes: settings.premiumArticleRequirement.minLikes,
			},
			feed: {
				trendingWindowHours: settings.feed.trendingWindowHours,
				minimumEngagementForTrending:
					settings.feed.minimumEngagementForTrending,
				articleDecayRate: settings.feed.articleDecayRate,
			},
		};
	}

	static toSessionSettingsDto(settings: SessionSettings): SessionSettingsDto {
		return {
			cancellationWindowHours: settings.cancellationWindowHours,
			rescheduleWindowHours: settings.rescheduleWindowHours,
			maxSessionsPerDayPerMentor: settings.maxSessionsPerDayPerMentor,
			platformFeePercentage: settings.platformFeePercentage,
		};
	}

	static toEconomySettingsEntity(dto: EconomySettingsDto): EconomySettings {
		return new EconomySettingsEntity(
			dto.purchaseRates.map(
				(rate) => new PurchaseRateEntity(rate.price, rate.coinsCount),
			),
			dto.payoutRates.map(
				(rate) =>
					new PayoutRateEntity(
						rate.coinsCountFrom,
						rate.coinsCountTo,
						rate.payoutPerCoinRate,
					),
			),
			dto.subscriptions.map(
				(plan) =>
					new SubscriptionPlanEntity(plan.id, plan.coinsCost, plan.type),
			),
			dto.userJoinRewardCoinCount,
			dto.maxCoinsEarnablePerDay,
			dto.maxCoinsFromReadingPerDay,
			dto.maxCoinsFromEngagementPerDay,
			dto.platformCommissionPercentage,
		);
	}

	static toMentorSettingsEntity(dto: MentorSettingsDto): MentorSettings {
		return new MentorSettingsEntity(
			dto.tiers.map(
				(tier) =>
					new MentorTierEntity(
						tier.id,
						tier.name,
						tier.rateForThirtyMinSession,
						tier.rateForSixtyMinSession,
						tier.minFreeArticlesPercentage,
						tier.maxArticlesPerWeek,
						tier.minSessionCompleted,
						tier.minArticlesPublished,
					),
			),
		);
	}

	static toContentSettingsEntity(dto: ContentSettingsDto): ContentSettings {
		return new ContentSettingsEntity(
			new PremiumArticleRequirementEntity(
				dto.premiumArticleRequirement.minFreeArticlesNewUserShouldHave,
				dto.premiumArticleRequirement.minArticleViews,
				dto.premiumArticleRequirement.minLikes,
			),
			new FeedSettingsEntity(
				dto.feed.trendingWindowHours,
				dto.feed.minimumEngagementForTrending,
				dto.feed.articleDecayRate,
			),
		);
	}

	static toSessionSettingsEntity(dto: SessionSettingsDto): SessionSettings {
		return new SessionSettingsEntity(
			dto.cancellationWindowHours,
			dto.rescheduleWindowHours,
			dto.maxSessionsPerDayPerMentor,
			dto.platformFeePercentage,
		);
	}
}
