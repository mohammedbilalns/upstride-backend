import { Types } from "mongoose";
import type { PopulatedConnection } from "../../../application/dtos/connection.dto";
import type { Connection } from "../../../domain/entities/connection.entity";
import type { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { ConnectionModel, type IConnection } from "../models/connection.model";
import { buildMutualMentorsPipeline } from "../utils/buildMutualMentorsPipeline";
import { checkObjectId } from "../utils/checkObjectId";
import { BaseRepository } from "./base.repository";
import { ErrorMessage } from "../../../common/enums";

export class ConnectionRepository
	extends BaseRepository<Connection, IConnection>
	implements IConnectionRepository
{
	constructor() {
		super(ConnectionModel);
	}

	protected mapToDomain(doc: IConnection): Connection {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			mentorId: mapped.mentorId,
			followerId: mapped.followerId,
			createdAt: mapped.createdAt,
		};
	}

	async fetchFollowers(
		mentorId: string,
		page: number,
		limit: number,
	): Promise<Connection[]> {
		checkObjectId(mentorId, ErrorMessage.MENTOR_NOT_FOUND);
		const skip = (page - 1) * limit;

		const docs = await this._model
			.find({ mentorId })
			.populate({
				path: "followerId",
				select: "name email phone profilePicture",
			})
			.skip(skip)
			.limit(limit)
			.exec();
		return docs.map((doc) => this.mapToDomain(doc));
	}

	async fetchFollowing(
		userId: string,
		page: number,
		limit: number,
	): Promise<Connection[]> {
		checkObjectId(userId, ErrorMessage.USER_NOT_FOUND);
		const skip = (page - 1) * limit;
		const docs = await this._model
			.find({ followerId: userId })
			.populate({
				path: "mentorId",
				select: "bio currentRole yearsOfExperience userId",
				populate: [
					{ path: "skillIds", select: "name -_id" },
					{ path: "expertiseId", select: "name -_id" },
					{ path: "userId", select: "name email profilePicture" },
				],
			})
			.skip(skip)
			.limit(limit)
			.exec();
		const mapped = docs.map((doc) => this.mapToDomain(doc));
		return mapped;
	}
	async fetchByUserAndMentor(
		userId: string,
		mentorId: string,
	): Promise<Connection | null> {
		checkObjectId(userId, ErrorMessage.USER_NOT_FOUND);
		const doc = await this._model
			.findOne({ mentorId, followerId: userId })
			.exec();
		return doc ? this.mapToDomain(doc) : null;
	}

	async fetchRecentActivity(userId: string): Promise<PopulatedConnection[]> {
		checkObjectId(userId, ErrorMessage.USER_NOT_FOUND);
		const objectId = new Types.ObjectId(userId);
		const recentActivities = await ConnectionModel.find({
			$or: [{ followerId: objectId }, { "mentorId.userId": objectId }],
		})
			.populate({
				path: "mentorId",
				populate: { path: "userId", select: "name profilePicture" },
			})
			.populate("followerId", "name profilePicture")
			.sort({ createdAt: -1 })
			.limit(5)
			.lean<PopulatedConnection[]>();

		return recentActivities;
	}

	async fetchMutualConnections(
		userId: string,
		limit: number = 5,
	): Promise<{ connections: PopulatedConnection[]; total: number }> {
		checkObjectId(userId, ErrorMessage.USER_NOT_FOUND);
		// Get mentors already followed by the user
		const userFollowedMentors = await this._model
			.find({
				followerId: new Types.ObjectId(userId),
			})
			.select("mentorId");

		const userFollowedMentorIds = userFollowedMentors.map((conn) =>
			conn.mentorId.toString(),
		);

		//  Find who else follows the user
		const othersFollowingSameMentors = await this._model
			.find({
				mentorId: {
					$in: userFollowedMentorIds.map((id) => new Types.ObjectId(id)),
				},
				followerId: { $ne: new Types.ObjectId(userId) },
			})
			.lean();

		if (othersFollowingSameMentors.length === 0) {
			return { connections: [], total: 0 };
		}

		const otherFollowerIds = othersFollowingSameMentors.map(
			(c) => c.followerId,
		);

		const theirMentors = await ConnectionModel.find({
			followerId: { $in: otherFollowerIds },
			mentorId: {
				$nin: userFollowedMentorIds.map((id) => new Types.ObjectId(id)),
			},
		}).lean();

		if (theirMentors.length === 0) {
			return { connections: [], total: 0 };
		}

		const result = await ConnectionModel.aggregate(
			buildMutualMentorsPipeline(userId, userFollowedMentorIds, limit),
		);

		const connections = result[0]?.connections || [];
		const total = result[0]?.totalCount[0]?.count || 0;

		return {
			connections: connections.map((conn: any) => ({
				id: conn._id.toString(),
				userId: conn.mentorUserId.toString(),
				name: conn.userName,
				profilePicture: conn.profilePicture,
				currentRole: conn.currentRole,
				organisation: conn.organisation,
				yearsOfExperience: conn.yearsOfExperience,
				followers: conn.followers,
				mutualConnectionCount: conn.mutualConnectionCount,
				expertise: {
					_id: conn.expertise._id.toString(),
					name: conn.expertise.name,
				},
			})),
			total,
		};
	}
}
