import { BaseRepository } from "./base.repository";
import { Skill } from "../../../domain/entities";
import { ISkill, skillModel } from "../models/skill.model";
import { ISkillRepository } from "../../../domain/repositories/skill.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";

export class SkillRepository
  extends BaseRepository<Skill, ISkill>
  implements ISkillRepository
{
  constructor() {
    super(skillModel);
  }

  protected mapToDomain(doc: ISkill): Skill {
    const mapped = mapMongoDocument(doc)!;
    return {
      id: mapped.id,
      name: mapped.name,
      expertiseId: mapped.expertiseId,
      isVerified: mapped.isVerified,
    };
  }

  async findAll(
    expertiseId: string,
    page: number,
    limit: number,
    query?: string,
  ): Promise<Skill[]> {
    const filter: any = {};

    if (expertiseId) {
      filter.expertiseId = expertiseId;
    }
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
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
  async exists(name: string, expertiseId: string): Promise<boolean> {
    const doc = await this._model.findOne({ name, expertiseId });
    return doc ? true : false;
  }
}
