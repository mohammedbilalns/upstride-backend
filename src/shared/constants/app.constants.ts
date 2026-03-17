export const CatalogLimits = {
	MAX_TOTAL_INTERESTS: 120,
	MAX_SKILLS_PER_INTEREST: 120,
	MAX_TOTAL_PROFESSIONS: 250,
} as const;

export const UserPreferencesLimits = {
	MIN_INTERESTS: 2,
	MAX_INTERESTS: 5,
	MIN_SKILLS_PER_INTEREST: 2,
	MAX_SKILLS_PER_INTEREST: 10,
} as const;
