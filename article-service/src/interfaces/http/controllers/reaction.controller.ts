import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IArticleRectionService} from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import { fetchReactionsParams, reactionSchema } from "../validations/reaction.validation";

export class ArticleReactionController {
	constructor(private _articleReactionService: IArticleRectionService) {}


	reactArticle = asyncHandler(async (req, res) => {
		const {articleId, reaction} = reactionSchema.parse(req.body);
		const userId = res.locals.user.id;
		await this._articleReactionService.reactToArticle({articleId, userId, reaction});
		res.status(HttpStatus.OK).send(ResponseMessage.REACTED_ARTICLE);
	});

	fetchReactions = asyncHandler(async (req, res) => {
		const {articleId, page, limit} = fetchReactionsParams.parse(req.query);	
		const reactions = await this._articleReactionService.getReactions(articleId, page, limit);
		res.status(HttpStatus.OK).send(reactions);
	});
}
