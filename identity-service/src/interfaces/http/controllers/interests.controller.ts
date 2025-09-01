import { IInterestsService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import { HttpStatus, ResponseMessage } from "../../../common/enums";

export class InterestsController {

	constructor(private _interestsService: IInterestsService){}
	
	fetchInterests = asyncHandler(async (_req, res) => {
		const { userId } = res.locals.user.id;
		const { expertises, skills } = await this._interestsService.fetchInterests(userId);
		res.status(HttpStatus.OK).json({ success: true, message: ResponseMessage.INTERESTS_FETCHED, expertises, skills });
	});

}
