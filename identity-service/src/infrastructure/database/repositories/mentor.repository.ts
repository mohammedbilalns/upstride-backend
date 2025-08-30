import { Mentor } from "../../../domain/entities/mentor.entity";
import { mentorModel, IMentor } from "../models/mentor.model";
import { IMenotorRepository } from "../../../domain/repositories/mentor.repository.interface";
import { BaseRepository } from "./base.repository";
import { mapMongoDocument } from "../mappers/mongoose.mapper";

export class MentorRepository
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
      isApproved: mapped.isApproved,
      isRejected: mapped.isRejected,
    };
  }

  async findByUserId(userId: string): Promise<Mentor | null> {
    const doc = await this._model.findOne({ userId }).exec();
    return doc ? this.mapToDomain(doc) : null;
  }
  async findAll(
    page: number,
    limit: number,
    query?: string,
    expertiseId?: string,
    skillIds?: string[],
  ): Promise<Mentor[]> {
    const filter: any = {};

    if (expertiseId) {
      filter.expertiseId = expertiseId;
    }

    if (skillIds && skillIds.length > 0) {
      filter.skillIds = { $all: skillIds };
    }

    if (query) {
      filter.$or = [
        { bio: { $regex: query, $options: "i" } },
        { currentRole: { $regex: query, $options: "i" } },
        { institution: { $regex: query, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const docs = await this._model
      .find(filter)
      .populate("expertiseId", "name _id")
      .populate("skillIds", "name _id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return docs.map(this.mapToDomain);
  }

  async count(
    query?: string,
    expertiseId?: string,
    skillIds?: string[],
  ): Promise<number> {
    const filter: any = {};

    if (expertiseId) {
      filter.expertiseId = expertiseId;
    }

    if (skillIds && skillIds.length > 0) {
      filter.skillIds = { $all: skillIds };
    }

    if (query) {
      filter.$or = [
        { bio: { $regex: query, $options: "i" } },
        { currentRole: { $regex: query, $options: "i" } },
        { institution: { $regex: query, $options: "i" } },
      ];
    }

    const total = await this._model.countDocuments(filter).exec();
    return total;
  }
}
