import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type { IReactionService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import {
	fetchReactionsParams,
	reactionSchema,
} from "../validations/reaction.validation";

export class ReactionController {
	constructor(private _reactionService: IReactionService) {}

	reactArticle = asyncHandler(async (req, res) => {
		const { resourceId, reaction, resourceType } = reactionSchema.parse(
			req.body,
		);
		const userId = res.locals.user.id;
		await this._reactionService.reactToResource({
			resourceId,
			resourceType,
			userId,
			reaction,
		});
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.REACTED_ARTICLE });
	});

	fetchReactions = asyncHandler(async (req, res) => {
		const { resourceId, page, limit } = fetchReactionsParams.parse(req.query);
		const reactions = await this._reactionService.getReactions(
			resourceId,
			page,
			limit,
		);
		res.status(HttpStatus.OK).send(reactions);
	});
}
