import { injectable } from "inversify";
import { Types } from "mongoose";
import type {
	AdminDashboardChartQuery,
	AdminDashboardMetricSource,
	AdminDashboardRevenueAnalyticsSource,
	AdminDashboardSessionOverviewSource,
	AdminDashboardSummarySource,
	AdminDashboardTopCategorySource,
	AdminDashboardTopMentorSource,
	AdminDashboardUserGrowthSource,
	IAdminDashboardRepository,
} from "../../../../domain/repositories/admin-dashboard.repository.interface";
import { COIN_VALUE } from "../../../../shared/constants/app.constants";
import { getSystemHealthSnapshot } from "../../../../shared/utilities/health-check.util";
import { AdminDashboardRepositoryMapper } from "../mappers/admin-dashboard.mapper";
import { BookingModel } from "../models/booking.model";
import { InterestModel } from "../models/interests.model";
import { MentorModel } from "../models/mentor.model";
import { PaymentTransactionModel } from "../models/payment-transactions.model";
import { SessionModel } from "../models/session.model";
import { UserModel } from "../models/user.model";

interface DateRange {
	start: Date;
	end: Date;
}

interface Bucket {
	label: string;
	start: Date;
	end: Date;
}

type LeanBooking = {
	mentorId: Types.ObjectId;
	startTime: Date;
	endTime: Date;
	status: string;
	paymentStatus: string;
	paymentType: "STRIPE" | "COINS";
	totalAmount: number;
};

type LeanPayment = {
	amount: number;
	purpose: "coins" | "session";
	transactionOwner?: "platform" | "user" | "mentor";
	createdAt: Date;
};

const IST_TIME_ZONE = "Asia/Kolkata";
const IST_OFFSET_MINUTES = 330;
const ACTIVE_WINDOW_MS = 15 * 60 * 1000;
const ACTIVE_TREND_BUCKET_MS = 5 * 60 * 1000;
const ACTIVE_TREND_BUCKET_COUNT = 12;

const dayLabelFormatter = new Intl.DateTimeFormat("en-IN", {
	timeZone: IST_TIME_ZONE,
	day: "numeric",
	month: "short",
});

const monthLabelFormatter = new Intl.DateTimeFormat("en-IN", {
	timeZone: IST_TIME_ZONE,
	month: "short",
});

const roundToTwo = (value: number): number =>
	Number((Number.isFinite(value) ? value : 0).toFixed(2));

const getIstParts = (date: Date) => {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: IST_TIME_ZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(date);

	return {
		year: Number(parts.find((part) => part.type === "year")?.value ?? "0"),
		month: Number(parts.find((part) => part.type === "month")?.value ?? "0"),
		day: Number(parts.find((part) => part.type === "day")?.value ?? "0"),
	};
};

const getUtcFromIst = (
	year: number,
	month: number,
	day: number,
	hour = 0,
	minute = 0,
	second = 0,
	millisecond = 0,
): Date =>
	new Date(
		Date.UTC(year, month - 1, day, hour, minute, second, millisecond) -
			IST_OFFSET_MINUTES * 60 * 1000,
	);

const getIstDateStart = (date: Date): Date => {
	const { year, month, day } = getIstParts(date);
	return getUtcFromIst(year, month, day);
};

const getIstDateEnd = (date: Date): Date => {
	const { year, month, day } = getIstParts(date);
	return getUtcFromIst(year, month, day, 23, 59, 59, 999);
};

const addIstDays = (date: Date, days: number): Date => {
	const { year, month, day } = getIstParts(date);
	return getUtcFromIst(year, month, day + days);
};

const getRangeFromQuery = (
	query: AdminDashboardChartQuery,
	now: Date = new Date(),
): DateRange => {
	if (query.period === "custom") {
		if (!query.startDate || !query.endDate) {
			throw new Error("Custom range requires startDate and endDate");
		}

		const [startYear, startMonth, startDay] = query.startDate
			.split("-")
			.map(Number);
		const [endYear, endMonth, endDay] = query.endDate.split("-").map(Number);

		return {
			start: getUtcFromIst(startYear, startMonth, startDay),
			end: getUtcFromIst(endYear, endMonth, endDay, 23, 59, 59, 999),
		};
	}

	if (query.period === "week") {
		return {
			start: addIstDays(now, -6),
			end: getIstDateEnd(now),
		};
	}

	if (query.period === "year") {
		const { year } = getIstParts(now);
		return {
			start: getUtcFromIst(year, 1, 1),
			end: getIstDateEnd(now),
		};
	}

	const { year, month } = getIstParts(now);
	return {
		start: getUtcFromIst(year, month, 1),
		end: getIstDateEnd(now),
	};
};

const getPreviousRange = (range: DateRange): DateRange => {
	const durationMs = range.end.getTime() - range.start.getTime() + 1;
	return {
		start: new Date(range.start.getTime() - durationMs),
		end: new Date(range.start.getTime() - 1),
	};
};

const buildBuckets = (
	query: AdminDashboardChartQuery,
	range: DateRange,
): Bucket[] => {
	if (query.period === "year") {
		const { year } = getIstParts(range.start);
		const nowMonth = getIstParts(range.end).month;
		return Array.from({ length: nowMonth }, (_, index) => {
			const month = index + 1;
			const start = getUtcFromIst(year, month, 1);
			const end =
				month === nowMonth
					? range.end
					: getUtcFromIst(year, month + 1, 0, 23, 59, 59, 999);

			return {
				label: monthLabelFormatter.format(getUtcFromIst(year, month, 1)),
				start,
				end,
			};
		});
	}

	const dayBuckets: Bucket[] = [];
	let cursor = range.start;
	while (cursor.getTime() <= range.end.getTime()) {
		const start = getIstDateStart(cursor);
		const end = getIstDateEnd(cursor);
		dayBuckets.push({
			label: dayLabelFormatter.format(start),
			start,
			end: end.getTime() > range.end.getTime() ? range.end : end,
		});
		cursor = addIstDays(cursor, 1);
	}

	if (query.period === "custom" && dayBuckets.length > 31) {
		const monthBuckets: Bucket[] = [];
		let monthCursor = range.start;

		while (monthCursor.getTime() <= range.end.getTime()) {
			const { year, month } = getIstParts(monthCursor);
			const start = getUtcFromIst(year, month, 1);
			const nextMonth =
				month === 12
					? getUtcFromIst(year + 1, 1, 1)
					: getUtcFromIst(year, month + 1, 1);
			const end = new Date(nextMonth.getTime() - 1);

			monthBuckets.push({
				label: monthLabelFormatter.format(getUtcFromIst(year, month, 1)),
				start: start.getTime() < range.start.getTime() ? range.start : start,
				end: end.getTime() > range.end.getTime() ? range.end : end,
			});

			monthCursor = nextMonth;
		}

		return monthBuckets;
	}

	return dayBuckets;
};

const toMonetaryBookingAmount = (
	booking: Pick<LeanBooking, "paymentType" | "totalAmount">,
): number =>
	booking.paymentType === "COINS"
		? booking.totalAmount / COIN_VALUE
		: booking.totalAmount;

const isUpcomingBooking = (
	booking: Pick<LeanBooking, "status" | "paymentStatus" | "endTime">,
	now: Date,
) =>
	booking.endTime.getTime() > now.getTime() &&
	booking.paymentStatus !== "FAILED" &&
	["PENDING", "CONFIRMED", "STARTED"].includes(booking.status);

const isCompletedBooking = (
	booking: Pick<LeanBooking, "status" | "paymentStatus">,
) => booking.status === "COMPLETED" && booking.paymentStatus === "COMPLETED";

const isCancelledBooking = (booking: Pick<LeanBooking, "status">) =>
	["CANCELLED_BY_MENTEE", "CANCELLED_BY_MENTOR"].includes(booking.status);

const toMetricSource = (
	total: number,
	current: number,
	previous: number,
): AdminDashboardMetricSource =>
	AdminDashboardRepositoryMapper.toMetricSource({
		total,
		current,
		previous,
	});

@injectable()
export class MongoAdminDashboardRepository
	implements IAdminDashboardRepository
{
	async getSummary(): Promise<AdminDashboardSummarySource> {
		const now = new Date();
		const defaultQuery: AdminDashboardChartQuery = { period: "month" };
		const currentRange = getRangeFromQuery(defaultQuery, now);
		const previousRange = getPreviousRange(currentRange);
		const currentAndPreviousStart = previousRange.start;

		const [
			totalUsers,
			currentUsers,
			previousUsers,
			totalMentors,
			currentMentors,
			previousMentors,
			allBookings,
			rangeBookings,
			activeUsersNow,
			activeUsersPrevious,
			activeUsersTrend,
			userGrowth,
			revenueAnalytics,
			sessionOverview,
			systemHealth,
			topMentors,
			topCategories,
			totalPayments,
			currentPayments,
			previousPayments,
		] = await Promise.all([
			UserModel.countDocuments({ role: "USER" }),
			UserModel.countDocuments({
				role: "USER",
				createdAt: { $gte: currentRange.start, $lte: currentRange.end },
			}),
			UserModel.countDocuments({
				role: "USER",
				createdAt: { $gte: previousRange.start, $lte: previousRange.end },
			}),
			MentorModel.countDocuments({ isApproved: true }),
			MentorModel.countDocuments({
				isApproved: true,
				createdAt: { $gte: currentRange.start, $lte: currentRange.end },
			}),
			MentorModel.countDocuments({
				isApproved: true,
				createdAt: { $gte: previousRange.start, $lte: previousRange.end },
			}),
			BookingModel.find(
				{
					status: { $ne: "SLOT_TAKEN_BY_ANOTHER_USER" },
					paymentStatus: { $ne: "FAILED" },
				},
				{
					startTime: 1,
					endTime: 1,
					status: 1,
					paymentStatus: 1,
					paymentType: 1,
					totalAmount: 1,
				},
			).lean<LeanBooking[]>(),
			BookingModel.find(
				{
					status: { $ne: "SLOT_TAKEN_BY_ANOTHER_USER" },
					paymentStatus: { $ne: "FAILED" },
					startTime: { $gte: currentAndPreviousStart, $lte: currentRange.end },
				},
				{
					startTime: 1,
					endTime: 1,
					status: 1,
					paymentStatus: 1,
					paymentType: 1,
					totalAmount: 1,
				},
			).lean<LeanBooking[]>(),
			SessionModel.countDocuments({
				revoked: false,
				expiresAt: { $gt: now },
				lastUsedAt: {
					$gte: new Date(now.getTime() - ACTIVE_WINDOW_MS),
					$lte: now,
				},
			}),
			SessionModel.countDocuments({
				revoked: false,
				expiresAt: { $gt: new Date(now.getTime() - ACTIVE_WINDOW_MS) },
				lastUsedAt: {
					$gte: new Date(now.getTime() - ACTIVE_WINDOW_MS * 2),
					$lt: new Date(now.getTime() - ACTIVE_WINDOW_MS),
				},
			}),
			this.getActiveUsersTrend(now),
			this.getUserGrowth(defaultQuery),
			this.getRevenueAnalytics(defaultQuery),
			this.getSessionOverview(),
			getSystemHealthSnapshot(),
			this.getTopMentors(currentRange, previousRange),
			this.getTopCategories(currentRange),
			this.getRevenuePayments(),
			this.getRevenuePayments(currentRange),
			this.getRevenuePayments(previousRange),
		]);

		const totalSessions = allBookings.length;
		const currentSessions = rangeBookings.filter(
			(booking) =>
				booking.startTime.getTime() >= currentRange.start.getTime() &&
				booking.startTime.getTime() <= currentRange.end.getTime(),
		).length;
		const previousSessions = rangeBookings.filter(
			(booking) =>
				booking.startTime.getTime() >= previousRange.start.getTime() &&
				booking.startTime.getTime() <= previousRange.end.getTime(),
		).length;

		return AdminDashboardRepositoryMapper.toSummarySource({
			metrics: {
				totalUsers: toMetricSource(totalUsers, currentUsers, previousUsers),
				totalMentors: toMetricSource(
					totalMentors,
					currentMentors,
					previousMentors,
				),
				totalSessions: toMetricSource(
					totalSessions,
					currentSessions,
					previousSessions,
				),
				totalRevenue: toMetricSource(
					this.sumRevenue(totalPayments),
					this.sumRevenue(currentPayments),
					this.sumRevenue(previousPayments),
				),
				activeUsersNow: toMetricSource(
					activeUsersNow,
					activeUsersNow,
					activeUsersPrevious,
				),
			},
			activeUsersTrend,
			userGrowth,
			sessionOverview,
			revenueAnalytics,
			topMentors,
			topCategories,
			systemHealth,
		});
	}

	async getUserGrowth(
		query: AdminDashboardChartQuery,
	): Promise<AdminDashboardUserGrowthSource> {
		const range = getRangeFromQuery(query);
		const buckets = buildBuckets(query, range);

		const [usersBefore, mentorsBefore, usersInRange, mentorsInRange] =
			await Promise.all([
				UserModel.countDocuments({
					role: "USER",
					createdAt: { $lt: range.start },
				}),
				MentorModel.countDocuments({
					isApproved: true,
					createdAt: { $lt: range.start },
				}),
				UserModel.find(
					{
						role: "USER",
						createdAt: { $gte: range.start, $lte: range.end },
					},
					{ createdAt: 1 },
				).lean<{ createdAt: Date }[]>(),
				MentorModel.find(
					{
						isApproved: true,
						createdAt: { $gte: range.start, $lte: range.end },
					},
					{ createdAt: 1 },
				).lean<{ createdAt: Date }[]>(),
			]);

		let runningUsers = usersBefore;
		let runningMentors = mentorsBefore;

		const series = buckets.map((bucket) => {
			const usersAdded = usersInRange.filter(
				(item) =>
					item.createdAt.getTime() >= bucket.start.getTime() &&
					item.createdAt.getTime() <= bucket.end.getTime(),
			).length;
			const mentorsAdded = mentorsInRange.filter(
				(item) =>
					item.createdAt.getTime() >= bucket.start.getTime() &&
					item.createdAt.getTime() <= bucket.end.getTime(),
			).length;

			runningUsers += usersAdded;
			runningMentors += mentorsAdded;

			return AdminDashboardRepositoryMapper.toUserGrowthPointSource({
				label: bucket.label,
				users: runningUsers,
				mentors: runningMentors,
			});
		});

		return AdminDashboardRepositoryMapper.toUserGrowthSource({
			period: query.period,
			labels: buckets.map((bucket) => bucket.label),
			series,
		});
	}

	async getRevenueAnalytics(
		query: AdminDashboardChartQuery,
	): Promise<AdminDashboardRevenueAnalyticsSource> {
		const range = getRangeFromQuery(query);
		const buckets = buildBuckets(query, range);
		const payments = await this.getRevenuePayments(range);

		const series = buckets.map((bucket) =>
			AdminDashboardRepositoryMapper.toRevenuePointSource({
				label: bucket.label,
				value: roundToTwo(
					payments
						.filter(
							(payment) =>
								payment.createdAt.getTime() >= bucket.start.getTime() &&
								payment.createdAt.getTime() <= bucket.end.getTime(),
						)
						.reduce((total, payment) => {
							const amountMajor = payment.amount / 100;
							if (payment.transactionOwner === "platform") {
								return total + amountMajor;
							}

							return payment.purpose === "coins" ? total + amountMajor : total;
						}, 0),
				),
			}),
		);

		const platformAmounts = payments
			.filter((payment) => payment.transactionOwner === "platform")
			.map((payment) => payment.amount / 100);

		return AdminDashboardRepositoryMapper.toRevenueAnalyticsSource({
			period: query.period,
			labels: series.map((point) => point.label),
			series,
			breakdown: AdminDashboardRepositoryMapper.toRevenueBreakdownSource({
				platformFees: roundToTwo(
					platformAmounts.reduce((sum, amount) => sum + amount, 0),
				),
				mentorPayouts: roundToTwo(
					Math.abs(
						platformAmounts
							.filter((amount) => amount < 0)
							.reduce((sum, amount) => sum + amount, 0),
					),
				),
				otherIncome: roundToTwo(
					payments
						.filter(
							(payment) =>
								payment.purpose === "coins" &&
								payment.transactionOwner !== "platform",
						)
						.reduce((sum, payment) => sum + payment.amount / 100, 0),
				),
			}),
		});
	}

	async getSessionOverview(): Promise<AdminDashboardSessionOverviewSource> {
		const now = new Date();
		const bookings = await BookingModel.find(
			{
				status: { $ne: "SLOT_TAKEN_BY_ANOTHER_USER" },
				paymentStatus: { $ne: "FAILED" },
			},
			{
				status: 1,
				paymentStatus: 1,
				endTime: 1,
			},
		).lean<Array<Pick<LeanBooking, "status" | "paymentStatus" | "endTime">>>();

		return AdminDashboardRepositoryMapper.toSessionOverviewSource({
			totalSessions:
				bookings.filter(isCompletedBooking).length +
				bookings.filter((booking) => isUpcomingBooking(booking, now)).length +
				bookings.filter(isCancelledBooking).length,
			completed: bookings.filter(isCompletedBooking).length,
			upcoming: bookings.filter((booking) => isUpcomingBooking(booking, now))
				.length,
			cancelled: bookings.filter(isCancelledBooking).length,
		});
	}

	private async getRevenuePayments(range?: DateRange): Promise<LeanPayment[]> {
		const dateFilter = range
			? { createdAt: { $gte: range.start, $lte: range.end } }
			: {};

		return PaymentTransactionModel.find(
			{
				status: "completed",
				$or: [
					{ transactionOwner: "platform" },
					{ transactionOwner: "user", purpose: "coins" },
					{ transactionOwner: { $exists: false }, purpose: "coins" },
					{ transactionOwner: null, purpose: "coins" },
				],
				...dateFilter,
			},
			{ amount: 1, purpose: 1, transactionOwner: 1, createdAt: 1 },
		).lean<LeanPayment[]>();
	}

	private sumRevenue(payments: LeanPayment[]): number {
		return roundToTwo(
			payments.reduce((total, payment) => {
				const amount = payment.amount / 100;
				if (payment.transactionOwner === "platform") {
					return total + amount;
				}

				return payment.purpose === "coins" ? total + amount : total;
			}, 0),
		);
	}

	private async getTopMentors(
		currentRange: DateRange,
		previousRange: DateRange,
	): Promise<AdminDashboardTopMentorSource[]> {
		const bookings = await BookingModel.find(
			{
				status: "COMPLETED",
				paymentStatus: "COMPLETED",
				endTime: { $gte: previousRange.start, $lte: currentRange.end },
			},
			{
				mentorId: 1,
				endTime: 1,
				paymentType: 1,
				totalAmount: 1,
			},
		).lean<
			Array<
				Pick<
					LeanBooking,
					"mentorId" | "endTime" | "paymentType" | "totalAmount"
				>
			>
		>();

		const mentorIds = [
			...new Set(bookings.map((booking) => booking.mentorId.toString())),
		];
		const mentors = await MentorModel.find(
			{ _id: { $in: mentorIds.map((id) => new Types.ObjectId(id)) } },
			{ userId: 1 },
		).lean<{ _id: Types.ObjectId; userId: Types.ObjectId }[]>();
		const users = await UserModel.find(
			{ _id: { $in: mentors.map((mentor) => mentor.userId) } },
			{ name: 1 },
		).lean<{ _id: Types.ObjectId; name: string }[]>();

		const mentorUserMap = new Map(
			mentors.map((mentor) => [
				mentor._id.toString(),
				mentor.userId.toString(),
			]),
		);
		const userNameMap = new Map(
			users.map((user) => [user._id.toString(), user.name]),
		);
		const totals = new Map<string, { current: number; previous: number }>();

		for (const booking of bookings) {
			const mentorId = booking.mentorId.toString();
			const existing = totals.get(mentorId) ?? { current: 0, previous: 0 };
			const amount = toMonetaryBookingAmount(booking);

			if (
				booking.endTime.getTime() >= currentRange.start.getTime() &&
				booking.endTime.getTime() <= currentRange.end.getTime()
			) {
				existing.current += amount;
			} else {
				existing.previous += amount;
			}

			totals.set(mentorId, existing);
		}

		return [...totals.entries()]
			.map(([mentorId, value]) => {
				const userId = mentorUserMap.get(mentorId) ?? "";
				return AdminDashboardRepositoryMapper.toTopMentorSource({
					mentorId,
					name: userNameMap.get(userId) ?? "Unknown Mentor",
					currentRevenue: roundToTwo(value.current),
					previousRevenue: roundToTwo(value.previous),
				});
			})
			.filter((item) => item.currentRevenue > 0)
			.sort((a, b) => b.currentRevenue - a.currentRevenue)
			.slice(0, 5);
	}

	private async getTopCategories(
		range: DateRange,
	): Promise<AdminDashboardTopCategorySource[]> {
		const bookings = await BookingModel.find(
			{
				status: { $ne: "SLOT_TAKEN_BY_ANOTHER_USER" },
				paymentStatus: { $ne: "FAILED" },
				startTime: { $gte: range.start, $lte: range.end },
			},
			{ mentorId: 1 },
		).lean<Array<{ mentorId: Types.ObjectId }>>();

		if (bookings.length === 0) {
			return [];
		}

		const mentorIds = [
			...new Set(bookings.map((booking) => booking.mentorId.toString())),
		];
		const mentors = await MentorModel.find(
			{ _id: { $in: mentorIds.map((id) => new Types.ObjectId(id)) } },
			{ areasOfExpertise: 1 },
		).lean<{ _id: Types.ObjectId; areasOfExpertise: Types.ObjectId[] }[]>();

		const interestIds = [
			...new Set(
				mentors.flatMap((mentor) =>
					mentor.areasOfExpertise.map((interestId) => interestId.toString()),
				),
			),
		];
		const interests = await InterestModel.find(
			{ _id: { $in: interestIds.map((id) => new Types.ObjectId(id)) } },
			{ name: 1 },
		).lean<{ _id: Types.ObjectId; name: string }[]>();

		const mentorInterestsMap = new Map(
			mentors.map((mentor) => [
				mentor._id.toString(),
				mentor.areasOfExpertise.map((interestId) => interestId.toString()),
			]),
		);
		const interestNameMap = new Map(
			interests.map((interest) => [interest._id.toString(), interest.name]),
		);
		const counts = new Map<string, number>();

		for (const booking of bookings) {
			for (const interestId of mentorInterestsMap.get(
				booking.mentorId.toString(),
			) ?? []) {
				counts.set(interestId, (counts.get(interestId) ?? 0) + 1);
			}
		}

		const total = [...counts.values()].reduce((sum, count) => sum + count, 0);

		return [...counts.entries()]
			.map(([categoryId, sessions]) =>
				AdminDashboardRepositoryMapper.toTopCategorySource({
					categoryId,
					name: interestNameMap.get(categoryId) ?? "Unknown Category",
					sessions,
					sharePercent: total > 0 ? roundToTwo((sessions / total) * 100) : 0,
				}),
			)
			.sort((a, b) => b.sessions - a.sessions)
			.slice(0, 5);
	}

	private async getActiveUsersTrend(now: Date) {
		const trendStart = new Date(
			now.getTime() - ACTIVE_TREND_BUCKET_COUNT * ACTIVE_TREND_BUCKET_MS,
		);

		const sessions = await SessionModel.find(
			{
				revoked: false,
				expiresAt: { $gt: trendStart },
				lastUsedAt: { $gte: trendStart, $lte: now },
			},
			{ lastUsedAt: 1 },
		).lean<{ lastUsedAt: Date }[]>();

		const buckets = Array.from(
			{ length: ACTIVE_TREND_BUCKET_COUNT },
			(_, index) => {
				const start = new Date(
					trendStart.getTime() + index * ACTIVE_TREND_BUCKET_MS,
				);

				return {
					label: `${start.getUTCHours().toString().padStart(2, "0")}:${start
						.getUTCMinutes()
						.toString()
						.padStart(2, "0")}`,
					start,
					end: new Date(start.getTime() + ACTIVE_TREND_BUCKET_MS),
				};
			},
		);

		return AdminDashboardRepositoryMapper.toSparklineSource({
			labels: buckets.map((bucket) => bucket.label),
			values: buckets.map(
				(bucket) =>
					sessions.filter(
						(session) =>
							session.lastUsedAt.getTime() >= bucket.start.getTime() &&
							session.lastUsedAt.getTime() < bucket.end.getTime(),
					).length,
			),
		});
	}
}
