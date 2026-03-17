import { EntityValidationError } from "../../errors";

const MAX_MIN_FREE_ARTICLES_NEW_USER = 1_000;
const MAX_MIN_ARTICLE_VIEWS = 1_000_000;
const MAX_MIN_LIKES = 100_000;
const MAX_TRENDING_WINDOW_HOURS = 720;
const MAX_MINIMUM_ENGAGEMENT = 1_000_000;
const MAX_ARTICLE_DECAY_RATE = 10;

export class PremiumArticleRequirement {
	public readonly minFreeArticlesNewUserShouldHave: number;

	public readonly minArticleViews: number;

	public readonly minLikes: number;

	constructor(
		minFreeArticlesNewUserShouldHave: number,
		minArticleViews: number,
		minLikes: number,
	) {
		if (
			minFreeArticlesNewUserShouldHave < 0 ||
			minArticleViews < 0 ||
			minLikes < 0
		) {
			throw new EntityValidationError(
				"PremiumArticleRequirement",
				"min free articles new user should have, min article views, and min likes must be non-negative",
			);
		}

		if (minFreeArticlesNewUserShouldHave > MAX_MIN_FREE_ARTICLES_NEW_USER) {
			throw new EntityValidationError(
				"PremiumArticleRequirement",
				"min free articles for new users is unrealistically high",
			);
		}

		if (minArticleViews > MAX_MIN_ARTICLE_VIEWS) {
			throw new EntityValidationError(
				"PremiumArticleRequirement",
				"min article views is unrealistically high",
			);
		}

		if (minLikes > MAX_MIN_LIKES) {
			throw new EntityValidationError(
				"PremiumArticleRequirement",
				"min likes is unrealistically high",
			);
		}

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
		if (
			trendingWindowHours < 0 ||
			minimumEngagementForTrending < 0 ||
			articleDecayRate < 0
		) {
			throw new EntityValidationError(
				"FeedSettings",
				"trending window hours, minimum engagement for trending, and article decay rate must be non-negative",
			);
		}

		if (trendingWindowHours > MAX_TRENDING_WINDOW_HOURS) {
			throw new EntityValidationError(
				"FeedSettings",
				"trending window hours is unrealistically high",
			);
		}

		if (minimumEngagementForTrending > MAX_MINIMUM_ENGAGEMENT) {
			throw new EntityValidationError(
				"FeedSettings",
				"minimum engagement for trending is unrealistically high",
			);
		}

		if (articleDecayRate > MAX_ARTICLE_DECAY_RATE) {
			throw new EntityValidationError(
				"FeedSettings",
				"article decay rate is unrealistically high",
			);
		}

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
