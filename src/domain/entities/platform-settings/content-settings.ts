export class PremiumArticleRequirement {
	public readonly minFreeArticlesNewUserShouldHave: number;

	public readonly minArticleViews: number;

	public readonly minLikes: number;

	constructor(
		minFreeArticlesNewUserShouldHave: number,
		minArticleViews: number,
		minLikes: number,
	) {
		this.minFreeArticlesNewUserShouldHave = minFreeArticlesNewUserShouldHave;
		this.minArticleViews = minArticleViews;
		this.minLikes = minLikes;
		Object.freeze(this);
	}
}

export class FeedSettings {
	public readonly trendingWindowHours: number;

	public readonly minimumEngagementForTrending: number;

	public readonly articleDecayRate: number;

	constructor(
		trendingWindowHours: number,
		minimumEngagementForTrending: number,
		articleDecayRate: number,
	) {
		this.trendingWindowHours = trendingWindowHours;
		this.minimumEngagementForTrending = minimumEngagementForTrending;
		this.articleDecayRate = articleDecayRate;
		Object.freeze(this);
	}
}

export class ContentSettings {
	public readonly premiumArticleRequirement: PremiumArticleRequirement;

	public readonly feed: FeedSettings;

	constructor(
		premiumArticleRequirement: PremiumArticleRequirement,
		feed: FeedSettings,
	) {
		this.premiumArticleRequirement = premiumArticleRequirement;
		this.feed = feed;
		Object.freeze(this);
	}
}
