import type { Connection } from "../../../domain/entities/connection.entity";
import type { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { ConnectionModel, type IConnection } from "../models/connection.model";
import { BaseRepository } from "./base.repository";

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
		};
	}

	async fetchFollowers(
		mentorId: string,
		page: number,
		limit: number,
	): Promise<{ followers: Connection[]; total: number }> {
		const skip = (page - 1) * limit;
		const [docs, total] = await Promise.all([
			this._model
				.find({ mentorId })
				.populate({
					path: "followerId",
					select: "name email phone profilePicture",
				})
				.skip(skip)
				.limit(limit)
				.exec(),
			this._model.countDocuments({ mentorId }).exec(),
		]);
		const mapped = docs.map((doc) => this.mapToDomain(doc));

		return { followers: mapped, total };
	}

	async fetchFollowing(
		userId: string,
		page: number,
		limit: number,
	): Promise<{ following: Connection[]; total: number }> {
		const skip = (page - 1) * limit;
		const [docs, total] = await Promise.all([
			this._model
				.find({ followerId: userId })
				.populate({
					path: "mentorId",
					select:
						"bio currentRole organisation yearsOfExperience educationalQualifications personalWebsite followers expertiseId, skillIds",
					populate: [
						{ path: "skillIds", select: "name" },
						{ path: "expertiseId", select: "name" },
					],
				})
				.skip(skip)
				.limit(limit)
				.exec(),
			this._model.countDocuments({ followerId: userId }),
		]);
		const mapped = docs.map((doc) => this.mapToDomain(doc));
		return { following: mapped, total };
	}
	async fetchByUserAndMentor(
		userId: string,
		mentorId: string,
	): Promise<Connection | null> {
		const doc = await this._model
			.findOne({ mentorId, followerId: userId })
			.exec();
		return doc ? this.mapToDomain(doc) : null;
	}
}
