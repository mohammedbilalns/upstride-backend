import type { Session } from "../entities/session.entity";
import type { CreatableRepository } from "./capabilities/creatable.repository.interface";

export interface ISessionRepository extends CreatableRepository<Session> {
	revoke(sid: string): Promise<void>;
	revokeMultiple(sids: string[]): Promise<void>;
	updateBySid(sid: string, data: Partial<Session>): Promise<void>;
	findBySid(sid: string): Promise<Session | null>;
	findAllByUserId(userId: string): Promise<Session[]>;
}
