import { injectable } from "inversify";
import type { IFeedCacheService } from "../../application/services";
import { LRUCache } from "./lru-cache";

const MAX_FEED_CACHE = 1000;
const FEED_CACHE_TTL = 1000 * 60 * 10;

@injectable()
export class LRUFeedCacheService implements IFeedCacheService {
	private cache: LRUCache<string, string[]>;

	constructor() {
		this.cache = new LRUCache(MAX_FEED_CACHE, FEED_CACHE_TTL);
	}

	get(key: string): string[] | null {
		return this.cache.get(key);
	}

	set(key: string, ids: string[]): void {
		this.cache.set(key, ids);
	}

	delete(key: string): void {
		this.cache.delete(key);
	}
}
