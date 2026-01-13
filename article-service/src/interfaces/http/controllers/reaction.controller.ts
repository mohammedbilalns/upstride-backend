import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type { IReactionService } from "../../../domain/services";
import asyncHandler from "../utils/async-handler";
import {
	fetchReactionsParams,
	reactionSchema,
} from "../validations/reaction.validation";

export class ReactionController {
	constructor(private _reactionService: IReactionService) {}

	public reactArticle = asyncHandler(async (req, res) => {
		const { resourceId, reaction, resourceType } = reactionSchema.parse(
			req.body,
		);
		const userId = res.locals.user.id;
		const userName = res.locals.user.name;
		await this._reactionService.reactToResource({
			resourceId,
			resourceType,
			userId,
			userName,
			reaction,
		});
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.REACTED_ARTICLE });
	});

	public fetchReactions = asyncHandler(async (req, res) => {
		const { resourceId, page, limit } = fetchReactionsParams.parse(req.query);
		const reactions = await this._reactionService.getReactions(
			resourceId,
			page,
			limit,
		);
		res.status(HttpStatus.OK).send(reactions);
	});
}
