export interface IFeedCacheService {
	get(key: string): string[] | null;
	set(key: string, ids: string[]): void;
	delete(key: string): void;
}
