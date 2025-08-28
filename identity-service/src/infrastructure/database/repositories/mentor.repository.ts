import { Mentor } from "../../../domain/entities/mentor.entity";
import { mentorModel, IMentorDocument } from "../models/mentor.model";
import { IMenotorRepository } from "../../../domain/repositories/mentor.repository.interface";
import { BaseRepository } from "./base.repository";
import { mapMongoDocument } from "../mappers/mongoose.mapper";

export class ExpertRepository
  extends BaseRepository<Mentor, IMentorDocument>
  implements IMenotorRepository
{
  constructor() {
    super(mentorModel);
  }

  protected mapToDomain(doc: IMentorDocument): Mentor {
    const mapped = mapMongoDocument(doc)!;
    return {
      id: mapped.id,
      userId: mapped.userId,
      expertiseId: mapped.expertiseId,
      customFields: mapped.customFields,
      status: mapped.status,
    };
  }

  async findAll(page: number, limit: number): Promise<Mentor[]> {
    const docs = await this._model
      .find()
      .skip(page * limit)
      .limit(limit)
      .exec();
    const mapped = docs.map(this.mapToDomain);
    return docs ? mapped : [];
  }
}
