import type { Expertise } from "../../../domain/entities";
import type { IExpertiseRepository } from "../../../domain/repositories/expertise.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { expertiseModel, type IExpertise } from "../models/expertise.model";
import { BaseRepository } from "./base.repository";

export class ExpertiseRepository
	extends BaseRepository<Expertise, IExpertise>
	implements IExpertiseRepository
{
	constructor() {
		super(expertiseModel);
	}

	protected mapToDomain(doc: IExpertise): Expertise {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			name: mapped.name,
			description: mapped.description,
			isVerified: mapped.isVerified,
		};
	}

	async findAll(
		page: number,
		limit: number,
		query?: string,
		isUser?: boolean,
	): Promise<Expertise[]> {
		const filter: any = {};

		if (isUser) {
			filter.isVerified = true;
		}

		if (query) {
			filter.$or = [
				{ name: { $regex: query, $options: "i" } },
				{ description: { $regex: query, $options: "i" } },
			];
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

	async createIfNotExists(expertise: Partial<Expertise>): Promise<Expertise> {
		const doc = await this._model.findOneAndUpdate(
			{ name: expertise.name },
			{ $setOnInsert: expertise },
			{ upsert: true, new: true },
		);

		return this.mapToDomain(doc!);
	}

	async count(query?: string, isUser?: boolean): Promise<number> {
		const filter: any = {};
		if (isUser) {
			filter.isVerified = true;
		}

		if (query) {
			filter.$and = [
				...(isUser ? [{ isVerified: true }] : []),
				{
					$or: [
						{ name: { $regex: query, $options: "i" } },
						{ description: { $regex: query, $options: "i" } },
					],
				},
			];
		}

		const total = await this._model.countDocuments(filter).exec();
		return total;
	}
}
