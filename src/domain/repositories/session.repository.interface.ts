import type { Session } from "../entities/session.entity";
import type { CreatableRepository } from "./capabilities/creatable.repository.interface";
import type { FindByOwnerRepository } from "./capabilities/find-by-owner.repository.interface";
import type { UpdatableByOwnerRepository } from "./capabilities/updatable-by-owner.repository.interface";

export interface ISessionRepository
	extends FindByOwnerRepository<Session>,
		CreatableRepository<Session>,
		UpdatableByOwnerRepository<Session> {
	findByTokenHash(tokenHash: string): Promise<Session | null>;
	revoke(sid: string): Promise<void>;
	revokeMultiple(sids: string[]): Promise<void>;
	updateBySid(sid: string, data: Partial<Session>): Promise<void>;
	findBySid(sid: string): Promise<Session | null>;
	findAllByUserId(userId: string): Promise<Session[]>;
}
