import type { User } from "../../../../domain/entities/user.entity";
import type { UserDocument } from "../models/user.model";

export class UserMapper {
	static toDomain(doc: UserDocument): User {
		return {
			id: doc._id.toString(),
			name: doc.name,
			email: doc.email,
			phone: doc.phone,
			password: doc.password,
			authType: doc.authType,
			profilePictureId: doc.profilePictureId,
			role: doc.role,
			isBlocked: doc.isBlocked,
			isVerified: doc.isVerified,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};
	}

	static toDocument(entity: User): Partial<UserDocument> {
		return {
			name: entity.name,
			email: entity.email,
			phone: entity.phone,
			password: entity.password,
			authType: entity.authType,
			profilePictureId: entity.profilePictureId,
			role: entity.role,
			isBlocked: entity.isBlocked,
			isVerified: entity.isVerified,
		};
	}
}
