import type { AdminDashboardChartQuery } from "../../../../domain/repositories/admin-dashboard.repository.interface";

export interface DateRange {
	start: Date;
	end: Date;
}

export interface Bucket {
	label: string;
	start: Date;
	end: Date;
}

const IST_TIME_ZONE = "Asia/Kolkata";
const IST_OFFSET_MINUTES = 330;

const dayLabelFormatter = new Intl.DateTimeFormat("en-IN", {
	timeZone: IST_TIME_ZONE,
	day: "numeric",
	month: "short",
});

const monthLabelFormatter = new Intl.DateTimeFormat("en-IN", {
	timeZone: IST_TIME_ZONE,
	month: "short",
});

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

export const getRangeFromQuery = (
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

export const getPreviousRange = (range: DateRange): DateRange => {
	const durationMs = range.end.getTime() - range.start.getTime() + 1;
	return {
		start: new Date(range.start.getTime() - durationMs),
		end: new Date(range.start.getTime() - 1),
	};
};

export const buildBuckets = (
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
