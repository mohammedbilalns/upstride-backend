import { TagService } from "../../../application/services/tag.service";
import type { ITagRepository } from "../../../domain/repositories";
import type { ITagService } from "../../../domain/services/tag.service.interface";
import { TagRepository } from "../../../infrastructure/database/repositories";
import { TagController } from "../controllers/tag.controller";

export function createTagController(): TagController {
	const tagRepository: ITagRepository = new TagRepository();
	const tagService: ITagService = new TagService(tagRepository);
	return new TagController(tagService);
}
