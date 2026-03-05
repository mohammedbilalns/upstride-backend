export interface ITokenRevocationRepository {
	revokeSession(sessionId: string, ttl: number): Promise<void>;
	revokeMultiple(sessions: { sessionId: string; ttl: number }[]): Promise<void>;
	isSessionRevoked(sessionId: string): Promise<boolean>;
}
