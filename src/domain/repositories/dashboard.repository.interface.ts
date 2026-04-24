import type { BookingStatus, PaymentStatus } from "../entities/booking.entity";

export type DashboardRole = "USER" | "MENTOR";
export type DashboardPeriod = "week" | "month" | "year";

export interface DashboardBookingAggregate {
	id: string;
	mentorId: string;
	mentorUserId: string | null;
	mentorName: string | null;
	mentorCategories: {
		id: string;
		name: string;
	}[];
	menteeId: string;
	menteeName: string | null;
	startTime: Date;
	endTime: Date;
	status: BookingStatus;
	paymentStatus: PaymentStatus;
	totalAmount: number;
	currency: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface DashboardSavedMentorAggregate {
	id: string;
	mentorId: string;
	mentorName: string | null;
	listId: string;
	listName: string | null;
	createdAt: Date;
}

export interface DashboardArticleAggregate {
	id: string;
	slug: string;
	title: string;
	description: string;
	featuredImageUrl: string;
	views: number;
	createdAt: Date;
	authorId: string;
}

export interface DashboardSessionAggregate {
	createdAt: Date;
	lastUsedAt: Date | null;
}

export interface DashboardSource {
	role: DashboardRole;
	bookings: DashboardBookingAggregate[];
	sessions: DashboardSessionAggregate[];
	articleViewsCount: number;
	recentArticles: DashboardArticleAggregate[];
	recentSavedMentors: DashboardSavedMentorAggregate[];
	mentorAverageRating: number | null;
}

export interface DashboardActivityOverviewSource {
	role: DashboardRole;
	bookings: DashboardBookingAggregate[];
}

export interface IDashboardRepository {
	getDashboardSource(input: {
		userId: string;
		role: DashboardRole;
	}): Promise<DashboardSource>;
	getActivityOverviewSource(input: {
		userId: string;
		role: DashboardRole;
		period: DashboardPeriod;
	}): Promise<DashboardActivityOverviewSource>;
}
