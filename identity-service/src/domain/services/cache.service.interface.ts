export interface ICacheService {
  set(key: string, value: string, expirySeconds?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
	incr(key: string): Promise<number>;
	expire(key: string, seconds: number): Promise<void>;
}
