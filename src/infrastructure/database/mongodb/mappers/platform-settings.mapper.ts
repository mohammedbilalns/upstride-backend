import type {
	ContentSettings,
	CreatePlatformSetting,
	EconomySettings,
	MentorSettings,
	PlatformSetting,
	PlatformSettingsType,
	SessionSettings,
} from "../../../../domain/entities/platform-settings.entity";
import {
	ContentSettings as ContentSettingsEntity,
	CreatePlatformSetting as CreatePlatformSettingEntity,
	EconomySettings as EconomySettingsEntity,
	FeedSettings as FeedSettingsEntity,
	MentorSettings as MentorSettingsEntity,
	MentorTier as MentorTierEntity,
	PayoutRate as PayoutRateEntity,
	PlatformSetting as PlatformSettingEntity,
	PremiumArticleRequirement as PremiumArticleRequirementEntity,
	PurchaseRate as PurchaseRateEntity,
	SessionSettings as SessionSettingsEntity,
	SubscriptionPlan as SubscriptionPlanEntity,
} from "../../../../domain/entities/platform-settings.entity";
import type { PlatformSettingDocument } from "../models/platform-settings.model";

export class PlatformSettingsMapper {
	static toDomain(doc: PlatformSettingDocument): PlatformSetting {
		return new PlatformSettingEntity(
			doc._id.toString(),
			doc.type,
			PlatformSettingsMapper.toSettingsData(doc.type, doc.data),
			doc.version,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(
		entity: Pick<
			PlatformSetting | CreatePlatformSetting,
			"type" | "data" | "version"
		>,
	): Partial<PlatformSettingDocument> {
		return {
			type: entity.type,
			data: PlatformSettingsMapper.toPlainData(entity.type, entity.data),
			version: entity.version,
		};
	}

	private static toSettingsData(
		type: PlatformSettingsType,
		data: unknown,
	): EconomySettings | MentorSettings | ContentSettings | SessionSettings {
		switch (type) {
			case "economy":
				return PlatformSettingsMapper.toEconomySettings(data);
			case "mentors":
				return PlatformSettingsMapper.toMentorSettings(data);
			case "content":
				return PlatformSettingsMapper.toContentSettings(data);
			case "sessions":
				return PlatformSettingsMapper.toSessionSettings(data);
		}
	}

	private static toEconomySettings(data: unknown): EconomySettings {
		const economy = data as {
			purchaseRates: { price: number; coinsCount: number }[];
			payoutRates: {
				coinsCountFrom: number;
				coinsCountTo: number;
				payoutPerCoinRate: number;
			}[];
			subscriptions: {
				id: string;
				coinsCost: number;
				type: "monthly" | "quarterly" | "yearly";
			}[];
			userJoinRewardCoinCount: number;
			maxCoinsEarnablePerDay: number;
			maxCoinsFromReadingPerDay: number;
			maxCoinsFromEngagementPerDay: number;
		};

		return new EconomySettingsEntity(
			economy.purchaseRates.map(
				(rate) => new PurchaseRateEntity(rate.price, rate.coinsCount),
			),
			economy.payoutRates.map(
				(rate) =>
					new PayoutRateEntity(
						rate.coinsCountFrom,
						rate.coinsCountTo,
						rate.payoutPerCoinRate,
					),
			),
			economy.subscriptions.map(
				(plan) =>
					new SubscriptionPlanEntity(plan.id, plan.coinsCost, plan.type),
			),
			economy.userJoinRewardCoinCount,
			economy.maxCoinsEarnablePerDay,
			economy.maxCoinsFromReadingPerDay,
			economy.maxCoinsFromEngagementPerDay,
		);
	}

	private static toMentorSettings(data: unknown): MentorSettings {
		const mentors = data as {
			tiers: {
				id: string;
				name: string;
				rateForThirtyMinSession: number;
				rateForSixtyMinSession: number;
				minFreeArticlesPercentage: number;
				maxArticlesPerWeek: number;
				minSessionCompleted: number;
				minArticlesPublished: number;
			}[];
		};

		return new MentorSettingsEntity(
			mentors.tiers.map(
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

	private static toContentSettings(data: unknown): ContentSettings {
		const content = data as {
			premiumArticleRequirement: {
				minFreeArticlesNewUserShouldHave: number;
				minArticleViews: number;
				minLikes: number;
			};
			feed: {
				trendingWindowHours: number;
				minimumEngagementForTrending: number;
				articleDecayRate: number;
			};
		};

		return new ContentSettingsEntity(
			new PremiumArticleRequirementEntity(
				content.premiumArticleRequirement.minFreeArticlesNewUserShouldHave,
				content.premiumArticleRequirement.minArticleViews,
				content.premiumArticleRequirement.minLikes,
			),
			new FeedSettingsEntity(
				content.feed.trendingWindowHours,
				content.feed.minimumEngagementForTrending,
				content.feed.articleDecayRate,
			),
		);
	}

	private static toSessionSettings(data: unknown): SessionSettings {
		const session = data as {
			cancellationWindowHours: number;
			rescheduleWindowHours: number;
			maxSessionsPerDayPerMentor: number;
			platformFeePercentage: number;
		};

		return new SessionSettingsEntity(
			session.cancellationWindowHours,
			session.rescheduleWindowHours,
			session.maxSessionsPerDayPerMentor,
			session.platformFeePercentage,
		);
	}

	private static toPlainData(
		type: PlatformSettingsType,
		data: CreatePlatformSetting["data"],
	): PlatformSettingDocument["data"] {
		return JSON.parse(
			JSON.stringify(new CreatePlatformSettingEntity(type, data).data),
		) as PlatformSettingDocument["data"];
	}
}
