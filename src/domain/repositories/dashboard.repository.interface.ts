import type {
	BookingStatus,
	PaymentStatus,
	PaymentType,
} from "../entities/booking.entity";
import type { ReviewSummary } from "./review.repository.interface";

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
	paymentType: PaymentType;
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
	recentReviews: ReviewSummary[];
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
