export type DashboardRole = "USER" | "MENTOR";

export type DashboardPeriod = "week" | "month" | "year";

export interface DashboardGrowthMetric {
	current: number;
	previous: number;
	changePercent: number;
}

export interface DashboardTopCategoryDto {
	id: string;
	name: string;
	count: number;
}

export interface DashboardUpcomingSessionDto {
	id: string;
	startTime: string;
	endTime: string;
	status: string;
	paymentStatus: string;
	mentorName: string | null;
	menteeName: string | null;
	totalAmount: number;
	currency: string;
}

export interface DashboardActivityItemDto {
	id: string;
	type: "SESSION_BOOKED" | "SESSION_COMPLETED" | "SAVED_MENTOR";
	title: string;
	description: string;
	occurredAt: string;
}

export interface DashboardArticleDto {
	id: string;
	slug: string;
	title: string;
	description: string;
	featuredImageUrl: string;
	views: number;
	createdAt: string;
}

export interface DashboardReviewDto {
	id: string;
	reviewerName: string;
	rating: number;
	comment: string;
	createdAt: string;
}

export interface DashboardActivityOverviewDto {
	period: DashboardPeriod;
	labels: string[];
	sessions: number[];
	hoursLearned: number[];
	earnings?: number[];
}

export interface DashboardEarningsChartDto {
	period: DashboardPeriod;
	labels: string[];
	values: number[];
}

export interface DashboardSummaryDto {
	role: DashboardRole;
	upcomingSessionsCount: number;
	completedSessionCount: number;
	hoursLearned: number;
	articlesRead?: number;
	totalRevenue?: number;
	platformFees?: number;
	netEarnings?: number;
	earningsCurrency?: string;
	totalSessionsAttended?: number;
	averageRating?: number;
	totalMentees?: number;
	consistentLoginDays: number;
	topCategory?: DashboardTopCategoryDto | null;
	sessionGrowth: DashboardGrowthMetric;
	hoursLearnedGrowth: DashboardGrowthMetric;
	upcomingSessions: DashboardUpcomingSessionDto[];
	activityOverview: DashboardActivityOverviewDto;
	recentActivity: DashboardActivityItemDto[];
	recommendedArticles: DashboardArticleDto[];
	earningsChart?: DashboardEarningsChartDto;
	recentReviews?: DashboardReviewDto[];
	totalAverageRating?: number;
}

export interface DashboardSummaryInput {
	userId: string;
	role: DashboardRole;
}

export interface DashboardActivityOverviewInput {
	userId: string;
	role: DashboardRole;
	period: DashboardPeriod;
}
