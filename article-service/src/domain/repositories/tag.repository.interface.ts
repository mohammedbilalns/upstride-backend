
import { IBaseRepository } from "./base.repository.interface";
import { Tag } from "../entities/tag.entity";
export interface ITagRepository extends IBaseRepository<Tag> {
	createOrIncrement(tag: string[]): Promise<string[]>;
	findByName(tag: string): Promise<Tag | null>;
}
