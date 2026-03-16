export const PlatformSettingsTypeValues = [
	"economy",
	"mentors",
	"content",
	"sessions",
] as const;

export type PlatformSettingsType = (typeof PlatformSettingsTypeValues)[number];

export const SubscriptionTypeValues = [
	"monthly",
	"quarterly",
	"yearly",
] as const;

export type SubscriptionType = (typeof SubscriptionTypeValues)[number];
