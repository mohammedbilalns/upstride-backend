import type {
	DashboardArticleAggregate,
	DashboardBookingAggregate,
	DashboardPeriod,
	DashboardRole,
	DashboardSource,
} from "../../../../domain/repositories/dashboard.repository.interface";
import type {
	DashboardActivityOverviewDto,
	DashboardArticleDto,
	DashboardEarningsChartDto,
	DashboardReviewDto,
	DashboardSummaryDto,
	DashboardUpcomingSessionDto,
} from "../dtos/dashboard.dto";
import {
	buildActivityOverview,
	buildHoursGrowth,
	buildSessionGrowth,
	buildTopCategory,
	calculateLoginStreak,
	countCompletedBookings,
	countUpcomingBookings,
	type DashboardBookingRecord,
	type DashboardSessionRecord,
	getBookingGrossCoins,
	getBookingMentorNetCoins,
	getBookingPlatformFeeCoins,
	getMenteeName,
	getMentorName,
	getMonthRangeForNow,
	mapRecentActivityBooking,
	sortRecentActivity,
	sumBookingHours,
} from "../utils/dashboard-analytics.util";

const toAnalyticsBooking = (
	booking: DashboardBookingAggregate,
): DashboardBookingRecord => ({
	_id: booking.id,
	mentorId: {
		_id: booking.mentorId,
		userId: booking.mentorUserId
			? { _id: booking.mentorUserId, name: booking.mentorName ?? undefined }
			: undefined,
		areasOfExpertise: booking.mentorCategories.map((category) => ({
			_id: category.id,
			id: category.id,
			name: category.name,
		})),
	},
	menteeId: {
		_id: booking.menteeId,
		name: booking.menteeName ?? undefined,
	},
	startTime: booking.startTime,
	endTime: booking.endTime,
	status: booking.status,
	paymentType: booking.paymentType,
	paymentStatus: booking.paymentStatus,
	totalAmount: booking.totalAmount,
	currency: booking.currency,
	createdAt: booking.createdAt,
	updatedAt: booking.updatedAt,
});

const toAnalyticsSession = (
	session: DashboardSource["sessions"][number],
): DashboardSessionRecord => ({
	createdAt: session.createdAt,
	lastUsedAt: session.lastUsedAt ?? undefined,
});

const toArticleDto = (
	article: DashboardArticleAggregate,
): DashboardArticleDto => ({
	id: article.id,
	slug: article.slug,
	title: article.title,
	description: article.description,
	featuredImageUrl: article.featuredImageUrl,
	views: article.views,
	createdAt: article.createdAt.toISOString(),
});

const toReviewDto = (
	review: DashboardSource["recentReviews"][number],
): DashboardReviewDto => ({
	id: review.id,
	reviewerName: review.reviewerName ?? "Anonymous",
	rating: review.rating,
	comment: review.comment,
	createdAt: review.createdAt.toISOString(),
});

const toRecentActivity = (source: DashboardSource, role: DashboardRole) => {
	const bookings = source.bookings.map(toAnalyticsBooking);
	const completedBookings = bookings.filter(
		(booking) =>
			booking.status === "COMPLETED" && booking.paymentStatus === "COMPLETED",
	);

	return sortRecentActivity([
		...bookings
			.slice(0, 10)
			.map((booking) =>
				mapRecentActivityBooking(booking, role, "SESSION_BOOKED"),
			),
		...completedBookings
			.slice(0, 10)
			.map((booking) =>
				mapRecentActivityBooking(booking, role, "SESSION_COMPLETED"),
			),
		...source.recentSavedMentors.map((record) => ({
			id: `${record.id}:SAVED_MENTOR`,
			type: "SAVED_MENTOR" as const,
			title: `Saved ${record.mentorName ?? "mentor"} to ${record.listName ?? "mentor list"}`,
			description: "Saved mentor activity",
			occurredAt: record.createdAt.toISOString(),
		})),
	]);
};

export class DashboardMapper {
	static toSummaryDto(source: DashboardSource): DashboardSummaryDto {
		const now = new Date();
		const monthRange = getMonthRangeForNow(now);
		const bookings = source.bookings.map(toAnalyticsBooking);
		const completedBookings = bookings.filter(
			(booking) =>
				booking.status === "COMPLETED" && booking.paymentStatus === "COMPLETED",
		);
		const activityOverview = buildActivityOverview(
			bookings,
			"month",
			source.role,
			now,
		);
		const sessionGrowth = buildSessionGrowth(
			bookings,
			monthRange.start,
			monthRange.end,
			source.role,
		);
		const hoursLearnedGrowth = buildHoursGrowth(
			bookings,
			monthRange.start,
			monthRange.end,
		);
		const sessions = source.sessions.map(toAnalyticsSession);

		const summary: DashboardSummaryDto = {
			role: source.role,
			upcomingSessionsCount: countUpcomingBookings(bookings, now),
			completedSessionCount: countCompletedBookings(bookings),
			hoursLearned: sumBookingHours(bookings),
			consistentLoginDays: calculateLoginStreak(sessions, now),
			sessionGrowth,
			hoursLearnedGrowth,
			upcomingSessions: bookings
				.filter((booking) => booking.endTime.getTime() > now.getTime())
				.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
				.slice(0, 2)
				.map(
					(booking) =>
						({
							id: booking._id,
							startTime: booking.startTime.toISOString(),
							endTime: booking.endTime.toISOString(),
							status: booking.status,
							paymentStatus: booking.paymentStatus,
							mentorName:
								source.role === "USER" ? getMentorName(booking.mentorId) : null,
							menteeName:
								source.role === "MENTOR"
									? getMenteeName(booking.menteeId)
									: null,
							totalAmount: booking.totalAmount,
							currency: booking.currency,
						}) satisfies DashboardUpcomingSessionDto,
				),
			activityOverview,
			recentActivity: toRecentActivity(source, source.role),
			recommendedArticles: source.recentArticles.slice(0, 3).map(toArticleDto),
		};

		if (source.role === "USER") {
			summary.articlesRead = source.articleViewsCount;
			summary.topCategory = buildTopCategory(bookings);
		}

		if (source.role === "MENTOR") {
			const totalRevenue = completedBookings.reduce(
				(total, booking) => total + getBookingGrossCoins(booking),
				0,
			);
			const platformFees = completedBookings.reduce(
				(total, booking) => total + getBookingPlatformFeeCoins(booking),
				0,
			);
			const netEarnings = completedBookings.reduce(
				(total, booking) => total + getBookingMentorNetCoins(booking),
				0,
			);
			const distinctMentees = new Set(
				bookings.map((booking) =>
					typeof booking.menteeId === "string"
						? booking.menteeId
						: (booking.menteeId._id ?? ""),
				),
			);

			summary.totalRevenue = Number(totalRevenue.toFixed(2));
			summary.platformFees = Number(platformFees.toFixed(2));
			summary.netEarnings = Number(netEarnings.toFixed(2));
			summary.earningsCurrency = "COINS";
			summary.totalSessionsAttended = completedBookings.length;
			summary.totalMentees = distinctMentees.size;
			summary.averageRating = 0;
			summary.totalAverageRating = source.mentorAverageRating ?? 0;
			summary.recentReviews = source.recentReviews.map(toReviewDto);
			summary.earningsChart = {
				period: "month",
				labels: activityOverview.labels,
				values: activityOverview.earnings ?? [],
			} satisfies DashboardEarningsChartDto;
		}

		return summary;
	}

	static toActivityOverviewDto(
		source: Pick<DashboardSource, "role" | "bookings">,
		period: DashboardPeriod,
	): DashboardActivityOverviewDto {
		return buildActivityOverview(
			source.bookings.map(toAnalyticsBooking),
			period,
			source.role,
			new Date(),
		);
	}
}
