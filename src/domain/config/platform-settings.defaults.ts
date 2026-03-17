import {
	EconomySettings,
	PlatformCommissions,
	SubscriptionPlan,
} from "../entities/platform-settings/coin-settings";
import {
	ContentSettings,
	FeedSettings,
	PremiumArticleRequirement,
} from "../entities/platform-settings/content-settings";
import {
	MentorSettings,
	MentorTier,
	MentorTierLevel,
} from "../entities/platform-settings/mentor-settings";
import { SessionSettings } from "../entities/platform-settings/session-settings";
import type { PlatformSettingsType } from "../entities/platform-settings/shared";

export interface PlatformSettingsDataMap {
	economy: EconomySettings;
	mentors: MentorSettings;
	content: ContentSettings;
	sessions: SessionSettings;
}

export type DefaultPlatformSettingsMap = {
	[K in PlatformSettingsType]: PlatformSettingsDataMap[K];
};

export const DEFAULT_PLATFORM_SETTINGS: DefaultPlatformSettingsMap = {
	economy: new EconomySettings(
		2,
		new PlatformCommissions(15, 10),
		[
			new SubscriptionPlan("monthly-basic", 400, "monthly"),
			new SubscriptionPlan("quarterly-basic", 1000, "quarterly"),
			new SubscriptionPlan("yearly-basic", 3600, "yearly"),
		],
		200,
		10000,
		300,
		200,
	),
	mentors: new MentorSettings(
		new MentorTier(MentorTierLevel.Starter, "Starter", 0, 40, 2000),
		new MentorTier(MentorTierLevel.Rising, "Rising", 40, 70, 4000),
		new MentorTier(MentorTierLevel.Expert, "Expert", 70, 100, 10000),
	),
	content: new ContentSettings(
		new PremiumArticleRequirement(5, 100, 20),
		new FeedSettings(24, 15, 1.0),
	),
	sessions: new SessionSettings(24, 12, 8),
};
