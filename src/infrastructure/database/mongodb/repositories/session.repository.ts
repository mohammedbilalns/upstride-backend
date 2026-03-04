import { injectable } from "inversify";
import type { Session } from "../../../../domain/entities/session.entity";
import type { ISessionRepository } from "../../../../domain/repositories/session.repository.interface";
import { SessionMapper } from "../mappers/session.mapper";
import { type SessionDocument, SessionModel } from "../models/session.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoSessionRepository
	extends AbstractMongoRepository<Session, SessionDocument>
	implements ISessionRepository
{
	constructor() {
		super(SessionModel);
	}

	protected toDomain(doc: SessionDocument): Session {
		return SessionMapper.toDomain(doc);
	}

	protected toDocument(entity: Session): Partial<SessionDocument> {
		return SessionMapper.toDocument(entity);
	}

	async create(session: Session): Promise<Session> {
		return this.createDocument(session);
	}

	async findByOwnerId(ownerId: string): Promise<Session | null> {
		const doc = await this.model.findOne({ userId: ownerId }).lean();
		return doc ? this.toDomain(doc as SessionDocument) : null;
	}

	async updateByOwnerId(
		ownerId: string,
		update: Partial<Session>,
	): Promise<Session | null> {
		const doc = await this.model
			.findOneAndUpdate({ userId: ownerId }, update, { new: true })
			.lean();
		return doc ? this.toDomain(doc as SessionDocument) : null;
	}

	async findByTokenHash(tokenHash: string): Promise<Session | null> {
		const doc = await this.model
			.findOne({ refreshTokenHash: tokenHash })
			.lean();
		return doc ? this.toDomain(doc as SessionDocument) : null;
	}

	async revoke(sessionId: string): Promise<void> {
		await this.model.updateOne({ _id: sessionId }, { $set: { revoked: true } });
	}

	async revokeAllByUserId(userId: string): Promise<void> {
		await this.model.updateMany({ userId }, { $set: { revoked: true } });
	}
}
