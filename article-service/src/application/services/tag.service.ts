import type { Tag } from "../../domain/entities/tag.entity";
import type { ITagRepository } from "../../domain/repositories";
import type { ITagService } from "../../domain/services/tag.service.interface";

export class TagService implements ITagService {
	constructor(private _tagRepository: ITagRepository) {}

	public async findMostUsedCounts(): Promise<Tag[]> {
		const limit = 8;
		return this._tagRepository.findMostUsed(limit);
	}
}
