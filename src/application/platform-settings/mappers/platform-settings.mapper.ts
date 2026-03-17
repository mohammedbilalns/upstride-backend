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
	PlatformCommissions as PlatformCommissionsEntity,
	PremiumArticleRequirement as PremiumArticleRequirementEntity,
	SessionSettings as SessionSettingsEntity,
	SubscriptionPlan as SubscriptionPlanEntity,
} from "../../../domain/entities/platform-settings.entity";
import type { FetchPlatformSettingsResponse } from "../dtos/fetch-platform-settings.dto";
import type {
	ContentSettingsDto,
	EconomySettingsDto,
	MentorSettingsDto,
	MentorTierDto,
	SessionSettingsDto,
} from "../dtos/platform-settings.types.dto";

const toMentorTierDto = (tier: MentorTierEntity): MentorTierDto => ({
	level: tier.level,
	name: tier.name,
	rateForThirtyMinSession: tier.rateForThirtyMinSession,
	minFreeArticlesPercentage: tier.minFreeArticlesPercentage,
	maxArticlesPerWeek: tier.maxArticlesPerWeek,
	minSessionCompleted: tier.minSessionCompleted,
	minArticlesPublished: tier.minArticlesPublished,
});

const toMentorTierEntity = (tier: MentorTierDto): MentorTierEntity =>
	new MentorTierEntity(
		tier.level,
		tier.name,
		tier.rateForThirtyMinSession,
		tier.minFreeArticlesPercentage,
		tier.maxArticlesPerWeek,
		tier.minSessionCompleted,
		tier.minArticlesPublished,
	);

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
			coinValue: settings.coinValue,
			platformCommissions: {
				sessionPercentage: settings.platformCommissions.sessionPercentage,
				userTipRewardPercentage:
					settings.platformCommissions.userTipRewardPercentage,
			},
			subscriptions: settings.subscriptions.map((plan) => ({
				id: plan.id,
				coinsCost: plan.coinsCost,
				type: plan.type,
			})),
			userJoinRewardCoinCount: settings.userJoinRewardCoinCount,
			maxCoinsEarnablePerDay: settings.maxCoinsEarnablePerDay,
			maxCoinsFromReadingPerDay: settings.maxCoinsFromReadingPerDay,
			maxCoinsFromEngagementPerDay: settings.maxCoinsFromEngagementPerDay,
		};
	}

	static toMentorSettingsDto(settings: MentorSettings): MentorSettingsDto {
		return {
			starter: toMentorTierDto(settings.starter),
			rising: toMentorTierDto(settings.rising),
			expert: toMentorTierDto(settings.expert),
			elite: toMentorTierDto(settings.elite),
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
		};
	}

	static toEconomySettingsEntity(dto: EconomySettingsDto): EconomySettings {
		return new EconomySettingsEntity(
			dto.coinValue,
			new PlatformCommissionsEntity(
				dto.platformCommissions.sessionPercentage,
				dto.platformCommissions.userTipRewardPercentage,
			),
			dto.subscriptions.map(
				(plan) =>
					new SubscriptionPlanEntity(plan.id, plan.coinsCost, plan.type),
			),
			dto.userJoinRewardCoinCount,
			dto.maxCoinsEarnablePerDay,
			dto.maxCoinsFromReadingPerDay,
			dto.maxCoinsFromEngagementPerDay,
		);
	}

	static toMentorSettingsEntity(dto: MentorSettingsDto): MentorSettings {
		return new MentorSettingsEntity(
			toMentorTierEntity(dto.starter),
			toMentorTierEntity(dto.rising),
			toMentorTierEntity(dto.expert),
			toMentorTierEntity(dto.elite),
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
		);
	}
}
