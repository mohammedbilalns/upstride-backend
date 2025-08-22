import { Profession } from "../../../domain/entities/profession.entity";
import { professionModel , IProfessionDocument} from "../models/profession.model";
import { IProfessionRepository } from "../../../domain/repositories/profession.repository.interface";
import { BaseRepository } from "./base.repository";
import { mapMongoDocument } from "../mappers/mongoose.mapper";

export class ProfessionRepository extends BaseRepository<Profession, IProfessionDocument> implements IProfessionRepository {

	constructor() {
		super(professionModel);
	}

	protected mapToDomain(doc: IProfessionDocument): Profession {
	    const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			name: mapped.name,
			description: mapped.description,
			fields: mapped.fields,
			isActive: mapped.isActive,
		};
	}
	
	async findAll(page: number, limit: number): Promise<Profession[]> {
		const docs = await this._model.find().skip(page * limit).limit(limit).exec();
		const mapped = docs.map(this.mapToDomain)
		return docs ? mapped : [];
	}

}
