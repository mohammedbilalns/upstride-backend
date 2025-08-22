import { Expert } from "../../../domain/entities/expert.entity";
import { expertModel, IExpertDocument } from "../models/expert.model";
import { IExpertRepository } from "../../../domain/repositories/expert.repository.interface";
import { BaseRepository } from "./base.repository";
import { mapMongoDocument } from "../mappers/mongoose.mapper";


export class ExpertRepository  extends BaseRepository<Expert, IExpertDocument> implements IExpertRepository {

	constructor() {
		super(expertModel);
	}

	protected mapToDomain(doc: IExpertDocument): Expert {
		const mapped = mapMongoDocument(doc)!; 
		return {
			id: mapped.id,
			userId: mapped.userId,
			professionId: mapped.professionId,
			customFields: mapped.customFields,
			status: mapped.status,
		};
	}

	async findAll(page: number, limit: number): Promise<Expert[]> {
		const docs = await this._model.find().skip(page * limit).limit(limit).exec();
		const mapped = docs.map(this.mapToDomain)
		return docs ? mapped : [];
	}

}
