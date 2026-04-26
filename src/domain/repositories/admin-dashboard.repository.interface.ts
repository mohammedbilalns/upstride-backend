import type { SystemHealthSnapshot } from "../../shared/utilities/health-check.util";

export type AdminDashboardPeriod = "week" | "month" | "year" | "custom";

export interface AdminDashboardChartQuery {
	period: AdminDashboardPeriod;
	startDate?: string;
	endDate?: string;
}

export interface AdminDashboardMetricSource {
	total: number;
	current: number;
	previous: number;
}

export interface AdminDashboardSparklineSource {
	labels: string[];
	values: number[];
}

export interface AdminDashboardUserGrowthPointSource {
	label: string;
	users: number;
	mentors: number;
}

export interface AdminDashboardUserGrowthSource {
	period: AdminDashboardPeriod;
	labels: string[];
	series: AdminDashboardUserGrowthPointSource[];
}

export interface AdminDashboardRevenuePointSource {
	label: string;
	value: number;
}

export interface AdminDashboardRevenueBreakdownSource {
	platformFees: number;
	mentorPayouts: number;
	otherIncome: number;
}

export interface AdminDashboardRevenueAnalyticsSource {
	period: AdminDashboardPeriod;
	labels: string[];
	series: AdminDashboardRevenuePointSource[];
	breakdown: AdminDashboardRevenueBreakdownSource;
}

export interface AdminDashboardSessionOverviewSource {
	totalSessions: number;
	completed: number;
	upcoming: number;
	cancelled: number;
}

export interface AdminDashboardTopMentorSource {
	mentorId: string;
	name: string;
	currentRevenue: number;
	previousRevenue: number;
}

export interface AdminDashboardTopCategorySource {
	categoryId: string;
	name: string;
	sessions: number;
	sharePercent: number;
}

export interface AdminDashboardSummarySource {
	metrics: {
		totalUsers: AdminDashboardMetricSource;
		totalMentors: AdminDashboardMetricSource;
		totalSessions: AdminDashboardMetricSource;
		totalRevenue: AdminDashboardMetricSource;
		activeUsersNow: AdminDashboardMetricSource;
	};
	activeUsersTrend: AdminDashboardSparklineSource;
	userGrowth: AdminDashboardUserGrowthSource;
	sessionOverview: AdminDashboardSessionOverviewSource;
	revenueAnalytics: AdminDashboardRevenueAnalyticsSource;
	topMentors: AdminDashboardTopMentorSource[];
	topCategories: AdminDashboardTopCategorySource[];
	systemHealth: SystemHealthSnapshot;
}

export interface IAdminDashboardRepository {
	getSummary(): Promise<AdminDashboardSummarySource>;
	getUserGrowth(
		query: AdminDashboardChartQuery,
	): Promise<AdminDashboardUserGrowthSource>;
	getRevenueAnalytics(
		query: AdminDashboardChartQuery,
	): Promise<AdminDashboardRevenueAnalyticsSource>;
	getSessionOverview(): Promise<AdminDashboardSessionOverviewSource>;
}
