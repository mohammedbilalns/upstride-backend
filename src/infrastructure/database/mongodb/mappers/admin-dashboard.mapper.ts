import type {
	AdminDashboardMetricSource,
	AdminDashboardRevenueAnalyticsSource,
	AdminDashboardRevenueBreakdownSource,
	AdminDashboardRevenuePointSource,
	AdminDashboardSessionOverviewSource,
	AdminDashboardSparklineSource,
	AdminDashboardSummarySource,
	AdminDashboardTopCategorySource,
	AdminDashboardTopMentorSource,
	AdminDashboardUserGrowthPointSource,
	AdminDashboardUserGrowthSource,
} from "../../../../domain/repositories/admin-dashboard.repository.interface";

export class AdminDashboardRepositoryMapper {
	static toMetricSource(input: AdminDashboardMetricSource) {
		return input satisfies AdminDashboardMetricSource;
	}

	static toSparklineSource(input: AdminDashboardSparklineSource) {
		return input satisfies AdminDashboardSparklineSource;
	}

	static toUserGrowthPointSource(input: AdminDashboardUserGrowthPointSource) {
		return input satisfies AdminDashboardUserGrowthPointSource;
	}

	static toUserGrowthSource(input: AdminDashboardUserGrowthSource) {
		return input satisfies AdminDashboardUserGrowthSource;
	}

	static toRevenuePointSource(input: AdminDashboardRevenuePointSource) {
		return input satisfies AdminDashboardRevenuePointSource;
	}

	static toRevenueBreakdownSource(input: AdminDashboardRevenueBreakdownSource) {
		return input satisfies AdminDashboardRevenueBreakdownSource;
	}

	static toRevenueAnalyticsSource(input: AdminDashboardRevenueAnalyticsSource) {
		return input satisfies AdminDashboardRevenueAnalyticsSource;
	}

	static toSessionOverviewSource(input: AdminDashboardSessionOverviewSource) {
		return input satisfies AdminDashboardSessionOverviewSource;
	}

	static toTopMentorSource(input: AdminDashboardTopMentorSource) {
		return input satisfies AdminDashboardTopMentorSource;
	}

	static toTopCategorySource(input: AdminDashboardTopCategorySource) {
		return input satisfies AdminDashboardTopCategorySource;
	}

	static toSummarySource(input: AdminDashboardSummarySource) {
		return input satisfies AdminDashboardSummarySource;
	}
}
