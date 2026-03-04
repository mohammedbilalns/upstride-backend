import { Types } from "mongoose";
import type { Session } from "../../../../domain/entities/session.entity";
import type { SessionDocument } from "../models/session.model";

export class SessionMapper {
	static toDomain(doc: SessionDocument): Session {
		return {
			id: doc._id.toString(),
			userId: doc.userId.toString(),
			refreshTokenHash: doc.refreshTokenHash,
			expiresAt: doc.expiresAt,
			ipAddress: doc.ipAddress,
			userAgent: doc.userAgent,
			deviceName: doc.deviceName,
			deviceType: doc.deviceType,
			revoked: doc.revoked,
			lastUsedAt: doc.lastUsedAt,
			createdAt: doc.createdAt,
		};
	}

	static toDocument(entity: Session): Partial<SessionDocument> {
		return {
			userId: new Types.ObjectId(entity.userId),
			refreshTokenHash: entity.refreshTokenHash,
			ipAddress: entity.ipAddress,
			userAgent: entity.userAgent,
			deviceName: entity.deviceName,
			deviceType: entity.deviceType,
			revoked: entity.revoked,
			lastUsedAt: entity.lastUsedAt,
			expiresAt: entity.expiresAt,
			...(entity.createdAt && { createdAt: entity.createdAt }),
		};
	}
}
