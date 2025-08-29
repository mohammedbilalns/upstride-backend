import { Mentor } from "../../../domain/entities/mentor.entity";
import { mentorModel, IMentor } from "../models/mentor.model";
import { IMenotorRepository } from "../../../domain/repositories/mentor.repository.interface";
import { BaseRepository } from "./base.repository";
import { mapMongoDocument } from "../mappers/mongoose.mapper";

export class ExpertRepository
  extends BaseRepository<Mentor, IMentor>
  implements IMenotorRepository
{
  constructor() {
    super(mentorModel);
  }

  protected mapToDomain(doc: IMentor): Mentor {
    const mapped = mapMongoDocument(doc)!;
    return {
      id: mapped.id,
      userId: mapped.userId,
      bio: mapped.bio,
      currentRole: mapped.currentRole,
      institution: mapped.institution,
      yearsOfExperience: mapped.yearsOfExperience,
      educationalQualifications: mapped.educationalQualifications,
      personalWebsite: mapped.personalWebsite,
      expertiseId: mapped.expertiseId,
      skillIds: mapped.skillIds,
      resumeUrl: mapped.resumeUrl,
      termsAccepted: mapped.termsAccepted,
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
