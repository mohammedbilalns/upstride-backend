import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import type {
	DashboardActivityOverviewSource,
	DashboardPeriod,
	DashboardRole,
	DashboardSource,
	IDashboardRepository,
} from "../../../../domain/repositories/dashboard.repository.interface";
import type { IReviewRepository } from "../../../../domain/repositories/review.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import {
	type ArticleDoc,
	type BookingDoc,
	DashboardRepositoryMapper,
	type SavedMentorDoc,
	type SessionDoc,
} from "../mappers/dashboard.mapper";
import { ArticleModel } from "../models/article.model";
import { ArticleViewModel } from "../models/article-view.model";
import { BookingModel } from "../models/booking.model";
import { InterestModel } from "../models/interests.model";
import { MentorModel } from "../models/mentor.model";
import { MentorListModel } from "../models/mentor-list.model";
import { SavedMentorModel } from "../models/saved-mentor.model";
import { SessionModel } from "../models/session.model";
import { UserModel } from "../models/user.model";

@injectable()
export class MongoDashboardRepository implements IDashboardRepository {
	constructor(
		@inject(TYPES.Repositories.ReviewRepository)
		private readonly _reviewRepository: IReviewRepository,
	) {}

	async getDashboardSource(input: {
		userId: string;
		role: DashboardRole;
	}): Promise<DashboardSource> {
		const [
			bookings,
			sessions,
			articleViewsCount,
			recentArticles,
			recentSavedMentors,
			mentorId,
		] = await Promise.all([
			this.getBookings(input.userId, input.role),
			this.getSessions(input.userId),
			this.getArticleViewsCount(input.userId),
			this.getRecentArticles(input.userId, input.role),
			this.getRecentSavedMentors(input.userId),
			this.getMentorId(input.userId),
		]);
		const [mentorAverageRating, recentReviews] = await Promise.all([
			this.getMentorAverageRating(mentorId, input.role),
			this.getRecentReviews(mentorId, input.role),
		]);

		return DashboardRepositoryMapper.toDashboardSource({
			role: input.role,
			bookings,
			sessions,
			articleViewsCount,
			recentArticles,
			recentSavedMentors,
			mentorAverageRating,
			recentReviews,
		});
	}

	async getActivityOverviewSource(input: {
		userId: string;
		role: DashboardRole;
		period: DashboardPeriod;
	}): Promise<DashboardActivityOverviewSource> {
		return {
			role: input.role,
			bookings: await this.getBookings(input.userId, input.role),
		};
	}

	private async getBookings(userId: string, role: DashboardRole) {
		const matchStage =
			role === "MENTOR"
				? { "mentorUser._id": new Types.ObjectId(userId) }
				: { menteeId: new Types.ObjectId(userId) };

		const docs = await BookingModel.aggregate([
			{
				$lookup: {
					from: MentorModel.collection.name,
					localField: "mentorId",
					foreignField: "_id",
					as: "mentor",
				},
			},
			{ $unwind: "$mentor" },
			{
				$lookup: {
					from: UserModel.collection.name,
					localField: "mentor.userId",
					foreignField: "_id",
					as: "mentorUser",
				},
			},
			{ $unwind: { path: "$mentorUser", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: InterestModel.collection.name,
					localField: "mentor.areasOfExpertise",
					foreignField: "_id",
					as: "mentorCategories",
				},
			},
			{
				$lookup: {
					from: UserModel.collection.name,
					localField: "menteeId",
					foreignField: "_id",
					as: "menteeUser",
				},
			},
			{ $unwind: { path: "$menteeUser", preserveNullAndEmptyArrays: true } },
			{ $match: matchStage },
			{
				$match: {
					status: {
						$nin: [
							"CANCELLED_BY_MENTEE",
							"CANCELLED_BY_MENTOR",
							"SLOT_TAKEN_BY_ANOTHER_USER",
						],
					},
					paymentStatus: { $ne: "FAILED" },
				},
			},
			{
				$project: {
					id: "$_id",
					mentorId: "$mentor._id",
					mentorUser: "$mentorUser",
					mentorCategories: {
						$map: {
							input: "$mentorCategories",
							as: "category",
							in: {
								id: { $toString: "$$category._id" },
								name: "$$category.name",
							},
						},
					},
					menteeId: { $toString: "$menteeId" },
					menteeUser: "$menteeUser",
					startTime: 1,
					endTime: 1,
					status: 1,
					paymentStatus: 1,
					totalAmount: 1,
					currency: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
			{ $sort: { createdAt: -1 } },
		]).exec();

		return DashboardRepositoryMapper.toBookings(docs as BookingDoc[]);
	}

	private async getSessions(userId: string) {
		const docs = await SessionModel.aggregate([
			{
				$match: {
					userId: new Types.ObjectId(userId),
					revoked: { $ne: true },
				},
			},
			{
				$project: {
					createdAt: 1,
					lastUsedAt: 1,
				},
			},
			{ $sort: { createdAt: -1 } },
		]).exec();

		return DashboardRepositoryMapper.toSessions(docs as SessionDoc[]);
	}

	private async getArticleViewsCount(userId: string) {
		const docs = await ArticleViewModel.aggregate([
			{
				$match: {
					userId: new Types.ObjectId(userId),
				},
			},
			{ $count: "count" },
		]).exec();
		return Number(docs[0]?.count ?? 0);
	}

	private async getRecentArticles(userId: string, role: DashboardRole) {
		const docs = await ArticleModel.aggregate([
			{
				$match: {
					isActive: true,
					isArchived: false,
					...(role === "MENTOR" && {
						authorId: { $ne: new Types.ObjectId(userId) },
					}),
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $limit: 3 },
			{
				$project: {
					id: "$_id",
					slug: 1,
					title: 1,
					description: 1,
					featuredImageUrl: 1,
					views: 1,
					createdAt: 1,
					authorId: { $toString: "$authorId" },
				},
			},
		]).exec();

		return DashboardRepositoryMapper.toArticles(docs as ArticleDoc[]);
	}

	private async getRecentSavedMentors(userId: string) {
		const docs = await SavedMentorModel.aggregate([
			{
				$match: {
					userId: new Types.ObjectId(userId),
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $limit: 10 },
			{
				$lookup: {
					from: MentorModel.collection.name,
					localField: "mentorId",
					foreignField: "_id",
					as: "mentor",
				},
			},
			{ $unwind: { path: "$mentor", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: UserModel.collection.name,
					localField: "mentor.userId",
					foreignField: "_id",
					as: "mentorUser",
				},
			},
			{ $unwind: { path: "$mentorUser", preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: MentorListModel.collection.name,
					localField: "listId",
					foreignField: "_id",
					as: "list",
				},
			},
			{ $unwind: { path: "$list", preserveNullAndEmptyArrays: true } },
			{
				$project: {
					id: "$_id",
					mentorId: { $toString: "$mentorId" },
					mentorUser: "$mentorUser",
					listId: { $toString: "$listId" },
					list: "$list",
					createdAt: 1,
				},
			},
		]).exec();

		return DashboardRepositoryMapper.toSavedMentors(docs as SavedMentorDoc[]);
	}

	private async getMentorId(userId: string) {
		const mentor = await MentorModel.findOne({ userId }).select("_id").lean<{
			_id: Types.ObjectId;
		}>();

		return mentor?._id.toString() ?? null;
	}

	private async getMentorAverageRating(
		mentorId: string | null,
		role: DashboardRole,
	) {
		if (role !== "MENTOR" || !mentorId) {
			return null;
		}

		const docs = await MentorModel.aggregate([
			{
				$match: {
					_id: new Types.ObjectId(mentorId),
				},
			},
			{
				$project: {
					avgRating: 1,
				},
			},
			{ $limit: 1 },
		]).exec();

		return docs[0]?.avgRating ?? null;
	}

	private async getRecentReviews(mentorId: string | null, role: DashboardRole) {
		if (role !== "MENTOR" || !mentorId) {
			return [];
		}

		const result = await this._reviewRepository.paginateByMentorId(
			mentorId,
			1,
			3,
		);

		return result.items;
	}
}
