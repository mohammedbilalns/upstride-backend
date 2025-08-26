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
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this._model.findOne({ email }).exec();
    return doc ? this.mapToDomain(doc) : null;
  }
}
