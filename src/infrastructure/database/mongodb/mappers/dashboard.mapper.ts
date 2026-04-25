import type {
	DashboardArticleAggregate,
	DashboardBookingAggregate,
	DashboardSavedMentorAggregate,
	DashboardSessionAggregate,
	DashboardSource,
} from "../../../../domain/repositories/dashboard.repository.interface";

type IdLike = { toString?: () => string } | string | null | undefined;

export type BookingDoc = {
	_id?: IdLike;
	id?: IdLike;
	mentorId?: IdLike;
	mentorUser?: { _id?: IdLike; name?: string } | null;
	mentorCategories?: Array<{
		id?: IdLike;
		_id?: IdLike;
		name?: string;
	}>;
	menteeId?: IdLike;
	menteeUser?: { _id?: IdLike; name?: string } | null;
	startTime?: Date | string;
	endTime?: Date | string;
	status?: DashboardBookingAggregate["status"];
	paymentStatus?: DashboardBookingAggregate["paymentStatus"];
	totalAmount?: number;
	currency?: string;
	createdAt?: Date | string;
	updatedAt?: Date | string;
};

export type SessionDoc = {
	createdAt?: Date | string;
	lastUsedAt?: Date | string | null;
};

export type ArticleDoc = {
	_id?: IdLike;
	id?: IdLike;
	slug?: string;
	title?: string;
	description?: string;
	featuredImageUrl?: string;
	views?: number;
	createdAt?: Date | string;
	authorId?: IdLike;
};

export type SavedMentorDoc = {
	_id?: IdLike;
	id?: IdLike;
	mentorId?: IdLike;
	mentorUser?: { _id?: IdLike; name?: string } | null;
	listId?: IdLike;
	list?: { _id?: IdLike; name?: string } | null;
	createdAt?: Date | string;
};

const toId = (value: IdLike): string => {
	if (!value) return "";
	if (typeof value === "string") return value;
	return value.toString?.() ?? "";
};

const toDate = (value: Date | string | null | undefined): Date =>
	value instanceof Date ? value : new Date(value ?? Date.now());

export class DashboardRepositoryMapper {
	static toBooking(doc: BookingDoc): DashboardBookingAggregate {
		const mentorUser = doc.mentorUser ?? null;
		const mentorCategories = (doc.mentorCategories ?? []).map((category) => ({
			id: toId(category.id ?? category._id),
			name: String(category.name ?? ""),
		}));
		const menteeUser = doc.menteeUser ?? null;

		return {
			id: toId(doc.id ?? doc._id),
			mentorId: toId(doc.mentorId),
			mentorUserId: toId(mentorUser?._id),
			mentorName: mentorUser?.name ?? null,
			mentorCategories,
			menteeId: toId(doc.menteeId),
			menteeName: menteeUser?.name ?? null,
			startTime: toDate(doc.startTime),
			endTime: toDate(doc.endTime),
			status: doc.status ?? "PENDING",
			paymentStatus: doc.paymentStatus ?? "PENDING",
			totalAmount: Number(doc.totalAmount ?? 0),
			currency: String(doc.currency ?? "inr"),
			createdAt: toDate(doc.createdAt),
			updatedAt: toDate(doc.updatedAt),
		};
	}

	static toBookings(docs: BookingDoc[]): DashboardBookingAggregate[] {
		return docs.map((doc) => DashboardRepositoryMapper.toBooking(doc));
	}

	static toSession(doc: SessionDoc): DashboardSessionAggregate {
		return {
			createdAt: toDate(doc.createdAt),
			lastUsedAt: doc.lastUsedAt ? toDate(doc.lastUsedAt) : null,
		};
	}

	static toSessions(docs: SessionDoc[]): DashboardSessionAggregate[] {
		return docs.map((doc) => DashboardRepositoryMapper.toSession(doc));
	}

	static toArticle(doc: ArticleDoc): DashboardArticleAggregate {
		return {
			id: toId(doc.id ?? doc._id),
			slug: String(doc.slug ?? ""),
			title: String(doc.title ?? ""),
			description: String(doc.description ?? ""),
			featuredImageUrl: String(doc.featuredImageUrl ?? ""),
			views: Number(doc.views ?? 0),
			createdAt: toDate(doc.createdAt),
			authorId: toId(doc.authorId),
		};
	}

	static toArticles(docs: ArticleDoc[]): DashboardArticleAggregate[] {
		return docs.map((doc) => DashboardRepositoryMapper.toArticle(doc));
	}

	static toSavedMentor(doc: SavedMentorDoc): DashboardSavedMentorAggregate {
		const mentorUser = doc.mentorUser ?? null;
		const list = doc.list ?? null;

		return {
			id: toId(doc.id ?? doc._id),
			mentorId: toId(doc.mentorId),
			mentorName: mentorUser?.name ?? null,
			listId: toId(doc.listId),
			listName: list?.name ?? null,
			createdAt: toDate(doc.createdAt),
		};
	}

	static toSavedMentors(
		docs: SavedMentorDoc[],
	): DashboardSavedMentorAggregate[] {
		return docs.map((doc) => DashboardRepositoryMapper.toSavedMentor(doc));
	}

	static toDashboardSource(source: DashboardSource): DashboardSource {
		return source;
	}
}
