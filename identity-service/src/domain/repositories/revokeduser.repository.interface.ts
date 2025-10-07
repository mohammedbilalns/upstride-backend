export interface IRevokedUserRepository {
	isRevoked(id: string): Promise<boolean>;
	add(id: string): Promise<void>;
	remove(id: string): Promise<void>;
}
