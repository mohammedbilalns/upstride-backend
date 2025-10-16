import { HttpStatus } from "../../../common/enums";
import type { ITagService } from "../../../domain/services/tag.service.interface";
import asyncHandler from "../utils/asyncHandler";

export class TagController {
	constructor(private _tagService: ITagService) {}

	fetchMostUsedTags = asyncHandler(async (_req, res) => {
		const tags = await this._tagService.findMostUsedCounts();
		res.status(HttpStatus.OK).json(tags);
	});
}
