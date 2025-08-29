import { User } from "../../../domain/entities/user.entity";
import { userModel, IUser } from "../models/user.model";
import { BaseRepository } from "./base.repository";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { IUserRepository } from "../../../domain/repositories/user.repository.interface";

export class UserRepository
  extends BaseRepository<User, IUser>
  implements IUserRepository
{
  constructor() {
    super(userModel);
  }

  protected mapToDomain(doc: IUser): User {
    const mapped = mapMongoDocument(doc)!;
    return {
      id: mapped.id,
      name: mapped.name,
      email: mapped.email,
      phone: mapped.phone,
      profilePicture: mapped.profilePicture,
      passwordHash: mapped.passwordHash,
      isBlocked: mapped.isBlocked,
      googleId: mapped.googleId,
      role: mapped.role,
      isVerified: mapped.isVerified,
      createdAt: mapped.createdAt!,
    };
  }

  async findByEmailAndRole(email: string, role: string): Promise<User | null> {
    const doc = await this._model.findOne({ email, role }).exec();
    return doc ? this.mapToDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this._model.findOne({ email }).exec();
    return doc ? this.mapToDomain(doc) : null;
  }

  async findAll(
    page: number,
    limit: number,
    allowedRoles: string[],
    query?: string,
  ): Promise<User[]> {
    const filter: any = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
    }

    if (allowedRoles?.length > 0) {
      filter.role = { $in: allowedRoles };
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

  count(allowedRoles: string[]): Promise<number> {
    const filter: any = {};

    if (allowedRoles?.length > 0) {
      filter.role = { $in: allowedRoles };
    }
    return this._model.countDocuments(filter);
  }
}
