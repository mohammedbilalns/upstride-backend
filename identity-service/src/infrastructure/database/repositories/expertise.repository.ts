import { Expertise } from "../../../domain/entities";
import { expertiseModel, IExpertiseDocument } from "../models/expertise.model";
import { IExpertiseRepository } from "../../../domain/repositories/expertise.repository.interface";
import { BaseRepository } from "./base.repository";
import { mapMongoDocument } from "../mappers/mongoose.mapper";

export class ProfessionRepository
  extends BaseRepository<Expertise, IExpertiseDocument>
  implements IExpertiseRepository
{
  constructor() {
    super(expertiseModel);
  }

  protected mapToDomain(doc: IExpertiseDocument): Expertise {
    const mapped = mapMongoDocument(doc)!;
    return {
      id: mapped.id,
      name: mapped.name,
      description: mapped.description,
      fields: mapped.fields,
      isActive: mapped.isActive,
    };
  }

  async findAll(page: number, limit: number): Promise<Expertise[]> {
    const docs = await this._model
      .find()
      .skip(page * limit)
      .limit(limit)
      .exec();
    const mapped = docs.map(this.mapToDomain);
    return docs ? mapped : [];
  }
}
