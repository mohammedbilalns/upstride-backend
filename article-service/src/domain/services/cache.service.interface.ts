export interface ICacheService {
	set<T>(key: string, value: T, ttl?: number): Promise<void>;
	get<T>(key: string): Promise<T | null>;
	del(key: string): Promise<void>;
	expire(key: string, ttl: number): Promise<void>;
	delByPattern(pattern: string): Promise<void>;
}
