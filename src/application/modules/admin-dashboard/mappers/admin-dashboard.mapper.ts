import type {
	AdminDashboardMetricSource,
	AdminDashboardRevenueAnalyticsSource,
	AdminDashboardSessionOverviewSource,
	AdminDashboardSummarySource,
	AdminDashboardTopMentorSource,
	AdminDashboardUserGrowthSource,
} from "../../../../domain/repositories/admin-dashboard.repository.interface";
import type {
	AdminDashboardMetricDto,
	AdminDashboardRevenueAnalyticsDto,
	AdminDashboardSessionOverviewDto,
	AdminDashboardSummaryDto,
	AdminDashboardTopMentorDto,
	AdminDashboardUserGrowthDto,
} from "../dtos/admin-dashboard.dto";

const roundToTwo = (value: number): number =>
	Number((Number.isFinite(value) ? value : 0).toFixed(2));

const toChangePercent = (current: number, previous: number): number => {
	if (previous === 0) {
		return current > 0 ? 100 : 0;
	}

	return roundToTwo(((current - previous) / previous) * 100);
};

export class AdminDashboardMapper {
	static toMetricDto(
		source: AdminDashboardMetricSource,
	): AdminDashboardMetricDto {
		return {
			...source,
			changePercent: toChangePercent(source.current, source.previous),
		};
	}

	static toUserGrowthDto(
		source: AdminDashboardUserGrowthSource,
	): AdminDashboardUserGrowthDto {
		return {
			period: source.period,
			labels: source.labels,
			series: source.series.map((point) => ({ ...point })),
		};
	}

	static toRevenueAnalyticsDto(
		source: AdminDashboardRevenueAnalyticsSource,
	): AdminDashboardRevenueAnalyticsDto {
		return {
			period: source.period,
			labels: source.labels,
			series: source.series.map((point) => ({ ...point })),
			breakdown: { ...source.breakdown },
		};
	}

	static toSessionOverviewDto(
		source: AdminDashboardSessionOverviewSource,
	): AdminDashboardSessionOverviewDto {
		return {
			...source,
			completionRate:
				source.totalSessions > 0
					? roundToTwo((source.completed / source.totalSessions) * 100)
					: 0,
			cancellationRate:
				source.totalSessions > 0
					? roundToTwo((source.cancelled / source.totalSessions) * 100)
					: 0,
		};
	}

	static toTopMentorDto(
		source: AdminDashboardTopMentorSource,
	): AdminDashboardTopMentorDto {
		return {
			mentorId: source.mentorId,
			name: source.name,
			revenue: source.currentRevenue,
			changePercent: toChangePercent(
				source.currentRevenue,
				source.previousRevenue,
			),
		};
	}

	static toSummaryDto(
		source: AdminDashboardSummarySource,
	): AdminDashboardSummaryDto {
		return {
			metrics: {
				totalUsers: AdminDashboardMapper.toMetricDto(source.metrics.totalUsers),
				totalMentors: AdminDashboardMapper.toMetricDto(
					source.metrics.totalMentors,
				),
				totalSessions: AdminDashboardMapper.toMetricDto(
					source.metrics.totalSessions,
				),
				totalRevenue: AdminDashboardMapper.toMetricDto(
					source.metrics.totalRevenue,
				),
			},
			topMentors: source.topMentors.map((mentor) =>
				AdminDashboardMapper.toTopMentorDto(mentor),
			),
			topCategories: source.topCategories.map((category) => ({ ...category })),
			systemHealth: source.systemHealth,
		};
	}
}
