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

	async findBySid(sid: string): Promise<Session | null> {
		const doc = await this.model.findOne({ sid }).lean();
		return doc ? this.toDomain(doc as SessionDocument) : null;
	}

	async revoke(sid: string): Promise<void> {
		await this.model.updateOne({ sid }, { $set: { revoked: true } });
	}

	async findAllByUserId(userId: string): Promise<Session[]> {
		const docs = await this.model.find({ userId }).lean();
		return docs.map((doc) => this.toDomain(doc as SessionDocument));
	}

	async revokeMultiple(sids: string[]): Promise<void> {
		if (sids.length === 0) return;
		await this.model.updateMany(
			{ sid: { $in: sids } },
			{ $set: { revoked: true } },
		);
	}

	async updateBySid(sid: string, data: Partial<Session>): Promise<void> {
		await this.model.findOneAndUpdate({ sid }, data);
	}
}
