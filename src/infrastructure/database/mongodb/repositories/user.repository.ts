import type { QueryFilter } from "mongoose";
import type { User } from "../../../../domain/entities/user.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type {
	UserQuery,
	UserRepository,
} from "../../../../domain/repositories/user.repository.interface";
import { UserMapper } from "../mappers/user.mapper";
import type { UserDocument } from "../models/user.model";
import { AbstractMongoRepository } from "./abstract.repository";

export class MongoUserRepository
	extends AbstractMongoRepository<User, UserDocument>
	implements UserRepository
{
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
			.findByIdAndUpdate(id, update, { new: true })
			.lean();

		return doc ? this.toDomain(doc as UserDocument) : null;
	}

	async findByEmail(email: string) {
		const doc = await this.model.findOne({ email }).lean();
		return doc ? this.toDomain(doc as UserDocument) : null;
	}

	async paginate({ page, limit, query, sort }: PaginateParams<UserQuery>) {
		const filter: QueryFilter<UserDocument> = {};

		if (query?.role) filter.role = query.role;
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
}
