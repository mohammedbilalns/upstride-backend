import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type {
	PopulatedInterest,
	PopulatedSkill,
	UserWithPopulatedPreferences,
} from "../../../../application/profile-management/dtos/get-profile.dto";
import type { User } from "../../../../domain/entities/user.entity";
import type { PaginateParams } from "../../../../domain/repositories";
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
			.findByIdAndUpdate(id, update, { returnDocument: "after" })
			.lean();

		return doc ? this.toDomain(doc as UserDocument) : null;
	}

	async findByEmail(email: string) {
		const doc = await this.model.findOne({ email }).lean();
		return doc ? this.toDomain(doc as UserDocument) : null;
	}

	async paginate({ page, limit, query, sort }: PaginateParams<UserQuery>) {
		const filter: QueryFilter<UserDocument> = {};

		if (query?.role) {
			filter.role = Array.isArray(query.role)
				? { $in: query.role }
				: query.role;
		}

		if (query?.isBlocked !== undefined) filter.isBlocked = query.isBlocked;

		if (query?.search) {
			filter.$or = [
				{ name: { $regex: query.search, $options: "i" } },
				{ email: { $regex: query.search, $options: "i" } },
			];
		}

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
			role: doc.role,
			profilePictureId: doc.profilePictureId,
			preferences: doc.preferences,
		};
	}

	async deleteById(id: string): Promise<void> {
		await this.model.deleteOne({ _id: id });
	}
}
