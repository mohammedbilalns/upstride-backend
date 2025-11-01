import type { User } from "../../../domain/entities/user.entity";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { mapPopulatedSubToDomain } from "../utils/mapPopulatedSubToDomain";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { type IUser, userModel } from "../models/user.model";
import { BaseRepository } from "./base.repository";

export class UserRepository
	extends BaseRepository<User, IUser>
	implements IUserRepository
{
	constructor() {
		super(userModel);
	}

	protected mapToDomain(doc: IUser): User {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			name: mapped.name,
			email: mapped.email,
			phone: mapped.phone,
			profilePicture: mapped.profilePicture,
			profilePictureId: mapped.profilePictureId,
			passwordHash: mapped.passwordHash,
			isBlocked: mapped.isBlocked,
			isRequestedForMentoring: mapped.isRequestedForMentoring,
			mentorRejectionReason: mapped.mentorRejectionReason,
			mentorRegistrationCount: mapped.mentorRegistrationCount,
			googleId: mapped.googleId,
			role: mapped.role,
			interestedExpertises: Array.isArray(mapped.interestedExpertises)
				? mapped.interestedExpertises.map(mapPopulatedSubToDomain)
				: [],
			interestedSkills: Array.isArray(mapped.interestedSkills)
				? mapped.interestedSkills.map(mapPopulatedSubToDomain)
				: [],
			isVerified: mapped.isVerified,
			createdAt: mapped.createdAt!,
		};
	}

	async findByEmailAndRole(email: string, role: string): Promise<User | null> {
		const doc = await this._model.findOne({ email, role }).exec();
		return doc ? this.mapToDomain(doc) : null;
	}
	async finddByIdAndRole(id: string, role: string): Promise<User | null> {
		const doc = await this._model.findOne({ id, role }).exec();
		return doc ? this.mapToDomain(doc) : null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const doc = await this._model.findOne({ email }).exec();
		return doc ? this.mapToDomain(doc) : null;
	}

	async findAll(
		page: number,
		limit: number,
		allowedRoles: string[],
		query?: string,
	): Promise<User[]> {
		const filter: any = {};

		if (query) {
			filter.$or = [
				{ name: { $regex: query, $options: "i" } },
				{ email: { $regex: query, $options: "i" } },
			];
		}

		if (allowedRoles?.length > 0) {
			filter.role = { $in: allowedRoles };
		}

		const skip = (page - 1) * limit;

		const docs = await this._model
			.find(filter)
			.sort(query ? {} : { createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.exec();
		return docs.map((doc) => this.mapToDomain(doc));
	}

	count(allowedRoles: string[]): Promise<number> {
		const filter: any = {};

		if (allowedRoles?.length > 0) {
			filter.role = { $in: allowedRoles };
		}
		return this._model.countDocuments(filter);
	}

	async findByIds(ids: string[]): Promise<User[]> {
		const filter = { id: { $in: ids } };
		const docs = await this._model.find(filter).exec();
		return docs.map((doc) => this.mapToDomain(doc));
	}

	async findByUserId(userId: string): Promise<User | null> {
		const doc = await this._model
			.findOne({ _id: userId })
			.populate({ path: "interestedExpertises", select: "name _id" })
			.populate({ path: "interestedSkills", select: "name _id" })
			.exec();
		return doc ? this.mapToDomain(doc) : null;
	}
}
