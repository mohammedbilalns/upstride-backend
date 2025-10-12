import type { Tag } from "../entities/tag.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface ITagRepository extends IBaseRepository<Tag> {
	createOrIncrement(tag: string[]): Promise<string[]>;
	findByName(tag: string): Promise<Tag | null>;
	findMostUsed(limit: number): Promise<Tag[]>;
}
