import { Tag } from "../../domain/entities/tag.entity";
import { ITagRepository } from "../../domain/repositories";
import { ITagService } from "../../domain/services/tag.service.interface";

export class TagService implements ITagService {
	constructor(private _tagRepository: ITagRepository){
	}

	async findMostUsedCounts(): Promise<Tag[]> {
		const limit = 8; 
		return this._tagRepository.findMostUsed(limit);
	}
}
