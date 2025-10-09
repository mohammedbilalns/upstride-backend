import { Tag } from "../entities/tag.entity";

export interface ITagService {
	findMostUsedCounts(): Promise<Tag[]>
}
