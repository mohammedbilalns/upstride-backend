import { injectable } from "inversify";
import type { MentorList } from "../../../../domain/entities/mentor-list.entity";
import type { IMentorListRepository } from "../../../../domain/repositories/mentor-list.repository.interface";
import { MentorListMapper } from "../mappers/mentor-list.mapper";
import {
	type MentorListDocument,
	MentorListModel,
} from "../models/mentor-list.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoMentorListRepository
	extends AbstractMongoRepository<MentorList, MentorListDocument>
	implements IMentorListRepository
{
	constructor() {
		super(MentorListModel);
	}

	protected toDomain(doc: MentorListDocument): MentorList {
		return MentorListMapper.toDomain(doc);
	}

	protected toDocument(entity: MentorList): Partial<MentorListDocument> {
		return MentorListMapper.toDocument(entity);
	}

	async create(entity: MentorList): Promise<MentorList> {
		return this.createDocument(entity);
	}

	async findById(id: string): Promise<MentorList | null> {
		return this.findByIdDocument(id);
	}

	async findAllByUserId(userId: string): Promise<MentorList[]> {
		const docs = await this.model
			.find({ userId })
			.sort({ createdAt: -1 })
			.lean();

		return docs.map((doc) => this.toDomain(doc as MentorListDocument));
	}

	async findByIdAndUserId(
		id: string,
		userId: string,
	): Promise<MentorList | null> {
		const doc = await this.model.findOne({ _id: id, userId }).lean();
		return doc ? this.toDomain(doc as MentorListDocument) : null;
	}

	async countByUserId(userId: string): Promise<number> {
		return this.model.countDocuments({ userId });
	}

	async deleteByIdAndUserId(id: string, userId: string): Promise<void> {
		await this.model.deleteOne({ _id: id, userId });
	}
}
