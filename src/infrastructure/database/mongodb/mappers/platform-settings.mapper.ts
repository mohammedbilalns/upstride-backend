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
	PlatformCommissions as PlatformCommissionsEntity,
	PlatformSetting as PlatformSettingEntity,
	PremiumArticleRequirement as PremiumArticleRequirementEntity,
	SessionSettings as SessionSettingsEntity,
	SubscriptionPlan as SubscriptionPlanEntity,
} from "../../../../domain/entities/platform-settings.entity";
import type { PlatformSettingDocument } from "../models/platform-settings.model";

export class PlatformSettingsMapper {
	static toDomain(doc: PlatformSettingDocument): PlatformSetting {
		return new PlatformSettingEntity(
			doc._id.toString(),
			doc.type,
			PlatformSettingsMapper._toSettingsData(doc.type, doc.data),
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
			data: PlatformSettingsMapper._toPlainData(entity.type, entity.data),
			version: entity.version,
		};
	}

	//FIX: violates ocp
	private static _toSettingsData(
		type: PlatformSettingsType,
		data: unknown,
	): EconomySettings | MentorSettings | ContentSettings | SessionSettings {
		switch (type) {
			case "economy":
				return PlatformSettingsMapper._toEconomySettings(data);
			case "mentors":
				return PlatformSettingsMapper._toMentorSettings(data);
			case "content":
				return PlatformSettingsMapper._toContentSettings(data);
			case "sessions":
				return PlatformSettingsMapper._toSessionSettings(data);
		}
	}

	private static _toEconomySettings(data: unknown): EconomySettings {
		const economy = data as {
			coinValue: number;
			platformCommissions: {
				sessionPercentage: number;
				userTipRewardPercentage: number;
			};
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
			economy.coinValue,
			new PlatformCommissionsEntity(
				economy.platformCommissions.sessionPercentage,
				economy.platformCommissions.userTipRewardPercentage,
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

	private static _toMentorSettings(data: unknown): MentorSettings {
		const mentors = data as {
			starter: {
				level: number;
				name: string;
				minScore: number;
				maxScore: number;
				maxPricePer30Min: number;
			};
			rising: {
				level: number;
				name: string;
				minScore: number;
				maxScore: number;
				maxPricePer30Min: number;
			};
			expert: {
				level: number;
				name: string;
				minScore: number;
				maxScore: number;
				maxPricePer30Min: number;
			};
		};

		return new MentorSettingsEntity(
			new MentorTierEntity(
				mentors.starter.level,
				mentors.starter.name,
				mentors.starter.minScore,
				mentors.starter.maxScore,
				mentors.starter.maxPricePer30Min,
			),
			new MentorTierEntity(
				mentors.rising.level,
				mentors.rising.name,
				mentors.rising.minScore,
				mentors.rising.maxScore,
				mentors.rising.maxPricePer30Min,
			),
			new MentorTierEntity(
				mentors.expert.level,
				mentors.expert.name,
				mentors.expert.minScore,
				mentors.expert.maxScore,
				mentors.expert.maxPricePer30Min,
			),
		);
	}

	private static _toContentSettings(data: unknown): ContentSettings {
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

	private static _toSessionSettings(data: unknown): SessionSettings {
		const session = data as {
			cancellationWindowHours: number;
			rescheduleWindowHours: number;
			maxSessionsPerDayPerMentor: number;
		};

		return new SessionSettingsEntity(
			session.cancellationWindowHours,
			session.rescheduleWindowHours,
			session.maxSessionsPerDayPerMentor,
		);
	}

	private static _toPlainData(
		type: PlatformSettingsType,
		data: CreatePlatformSetting["data"],
	): PlatformSettingDocument["data"] {
		return JSON.parse(
			JSON.stringify(new CreatePlatformSettingEntity(type, data).data),
		) as PlatformSettingDocument["data"];
	}
}
