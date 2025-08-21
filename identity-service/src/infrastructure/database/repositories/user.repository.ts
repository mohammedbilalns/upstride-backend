import { User } from "../../../domain/entities/user.entity";
import { userModel, IUser } from "../models/user.model";
import { BaseRepository } from "./base.repository";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { IUserRepository } from "../../../domain/repositories/user.repository.interface";

export class UserRepository extends BaseRepository<User, IUser> implements IUserRepository {
  constructor() {
    super(userModel);
  }

  protected mapToDomain(doc: IUser): User {
    const mapped = mapMongoDocument(doc)!;
    return {
      id: mapped.id,
      name: mapped.name,
      email: mapped.email,
      profilePicture: mapped.profilePicture,
      isBlocked: mapped.isBlocked,
      googleId: mapped.googleId,
      passwordHash: mapped.passwordHash,
      roles: mapped.roles,
      isVerified: mapped.isVerified,
      createdAt: mapped.createdAt,
      updatedAt: mapped.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this._model.findOne({ email }).exec();
    return doc ? this.mapToDomain(doc) : null;
  }
}
