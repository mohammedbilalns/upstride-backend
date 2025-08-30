import { Expertise } from "../../../domain/entities";
import { expertiseModel, IExpertise } from "../models/expertise.model";
import { IExpertiseRepository } from "../../../domain/repositories/expertise.repository.interface";
import { BaseRepository } from "./base.repository";
import { mapMongoDocument } from "../mappers/mongoose.mapper";

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
  ): Promise<Expertise[]> {
    const filter: any = {};

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

  async count(query?: string): Promise<number> {
    const filter: any = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    const total = await this._model.countDocuments(filter).exec();
    return total;
  }
}
