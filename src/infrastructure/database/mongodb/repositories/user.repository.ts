import { injectable } from "inversify";
import { type QueryFilter, Types } from "mongoose";
import type { User } from "../../../../domain/entities/user.entity";
import type {
	PopulatedInterest,
	PopulatedSkill,
	UserWithPopulatedPreferences,
} from "../../../../domain/entities/user-preferences.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type {
	IUserRepository,
	UserQuery,
} from "../../../../domain/repositories/user.repository.interface";
import { UserMapper } from "../mappers/user.mapper";
import { type UserDocument, UserModel } from "../models/user.model";
import { AbstractMongoRepository } from "./abstract.repository";

interface PopulatedUserDoc extends Omit<UserDocument, "preferences"> {
	preferences?: {
		interests: PopulatedInterest[];
		skills: PopulatedSkill[];
	};
}

@injectable()
export class MongoUserRepository
	extends AbstractMongoRepository<User, UserDocument>
	implements IUserRepository
{
	constructor() {
		super(UserModel);
	}

	protected toDomain(doc: UserDocument): User {
		return UserMapper.toDomain(doc);
	}

	protected toDocument(entity: User): Partial<UserDocument> {
		return UserMapper.toDocument(entity);
	}

	async create(user: User): Promise<User> {
		return this.createDocument(user);
	}

	async findById(id: string): Promise<User | null> {
		return this.findByIdDocument(id);
	}

	async updateById(id: string, update: Partial<User>) {
		const doc = await this.model
			.findByIdAndUpdate(id, { $set: update }, { returnDocument: "after" })
			.lean();

		return doc ? this.toDomain(doc as UserDocument) : null;
	}

	async findByEmail(email: string) {
		const doc = await this.model.findOne({ email }).lean();
		return doc ? this.toDomain(doc as UserDocument) : null;
	}

	async findByGoogleId(googleId: string) {
		const doc = await this.model.findOne({ googleId }).lean();
		return doc ? this.toDomain(doc as UserDocument) : null;
	}

	async findByLinkedinId(linkedinId: string) {
		const doc = await this.model.findOne({ linkedinId }).lean();
		return doc ? this.toDomain(doc as UserDocument) : null;
	}

	async query({ query, sort }: QueryParams<UserQuery>): Promise<User[]> {
		const filter = this._buildFilter(query);
		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();
		return docs.map((doc) => this.toDomain(doc as UserDocument));
	}

	async paginate({ page, limit, query, sort }: PaginateParams<UserQuery>) {
		const filter = this._buildFilter(query);
		const skip = (page - 1) * limit;

		const [docs, total] = await Promise.all([
			this.model
				.find(filter)
				.sort(sort ?? { createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			this.model.countDocuments(filter),
		]);

		const items = docs.map((doc) => this.toDomain(doc as UserDocument));

		return this.buildPaginatedResult(items, total, page, limit);
	}

	private _buildFilter(query?: UserQuery): QueryFilter<UserDocument> {
		const filter: QueryFilter<UserDocument> = {};

		if (!query) return filter;

		if (query.role) {
			filter.role = Array.isArray(query.role)
				? { $in: query.role }
				: query.role;
		}

		if (query.isBlocked !== undefined) {
			filter.isBlocked = query.isBlocked;
		}

		if (query.interestIds && query.interestIds.length > 0) {
			filter["preferences.interests"] = {
				$in: query.interestIds.map((id) => new Types.ObjectId(id)),
			};
		}

		if (query.search) {
			filter.$or = [
				{ name: { $regex: query.search, $options: "i" } },
				{ email: { $regex: query.search, $options: "i" } },
			];
		}

		return filter;
	}

	async findProfileById(
		id: string,
	): Promise<UserWithPopulatedPreferences | null> {
		const doc = (await this.model
			.findById(id)
			.populate("preferences.interests", "name")
			.populate("preferences.skills.skillId", "name interestId")
			.lean()) as PopulatedUserDoc | null;

		if (!doc) return null;

		return {
			id: doc._id.toString(),
			name: doc.name,
			email: doc.email,
			phone: doc.phone || "",
			coinBalance: doc.coinBalance ?? 0,
			role: doc.role,
			authType: doc.authType,
			profilePictureId: doc.profilePictureId,
			preferences: doc.preferences,
		};
	}

	async deleteById(id: string): Promise<void> {
		await this.model.deleteOne({ _id: id });
	}

	async incrementBalance(userId: string, amount: number): Promise<void> {
		const doc = await this.model
			.findByIdAndUpdate(userId, { $inc: { coinBalance: amount } })
			.lean();

		if (!doc) {
			throw new Error("User not found");
		}
	}

	async getStats() {
		const stats = await this.model.aggregate([
			{
				$facet: {
					totalUsers: [{ $match: { role: "USER" } }, { $count: "count" }],
					totalMentors: [{ $match: { role: "MENTOR" } }, { $count: "count" }],
					totalAdmins: [{ $match: { role: "ADMIN" } }, { $count: "count" }],
					activeAdmins: [
						{ $match: { role: "ADMIN", isBlocked: false } },
						{ $count: "count" },
					],
					blockedAdmins: [
						{ $match: { role: "ADMIN", isBlocked: true } },
						{ $count: "count" },
					],
				},
			},
		]);

		const res = stats[0];
		return {
			totalUsers: res.totalUsers[0]?.count || 0,
			totalMentors: res.totalMentors[0]?.count || 0,
			totalAdmins: res.totalAdmins[0]?.count || 0,
			activeAdmins: res.activeAdmins[0]?.count || 0,
			blockedAdmins: res.blockedAdmins[0]?.count || 0,
		};
	}
}
