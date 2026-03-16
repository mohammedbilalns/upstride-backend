import {
	EconomySettings,
	PayoutRate,
	PurchaseRate,
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
		[
			new PurchaseRate(100, 120),
			new PurchaseRate(500, 650),
			new PurchaseRate(1000, 1400),
		],
		[
			new PayoutRate(1, 999, 0.6),
			new PayoutRate(1000, 4999, 0.75),
			new PayoutRate(5000, 999999, 0.9),
		],
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
	mentors: new MentorSettings([
		new MentorTier("tier-1", "Tier 1", 200, 350, 80, 7, 0, 0),
		new MentorTier("tier-2", "Tier 2", 250, 650, 65, 14, 10, 3),
		new MentorTier("tier-3", "Tier 3", 600, 1100, 50, 25, 30, 8),
		new MentorTier("tier-4", "Tier 4", 1000, 1800, 30, 40, 80, 15),
	]),
	content: new ContentSettings(
		new PremiumArticleRequirement(5, 100, 20),
		new FeedSettings(24, 15, 1.0),
	),
	sessions: new SessionSettings(24, 12, 8, 12),
};
