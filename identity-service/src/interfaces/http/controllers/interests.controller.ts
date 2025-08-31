import { IInterestsService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { addInterestsSchema } from "../validations/interests.validation";

export class InterestsController {

	constructor(private _interestsService: IInterestsService){}
	
	addInterests = asyncHandler(async (req, res) => {
		const { expertises, skills } = addInterestsSchema.parse(req.body);
		const { userId } = res.locals.user.id;
		await this._interestsService.createInterests(userId, expertises, skills);
		res.status(HttpStatus.OK).json({ success: true, message: ResponseMessage.INTERESTS_ADDED });
	});

	fetchInterests = asyncHandler(async (_req, res) => {
		const { userId } = res.locals.user.id;
		const { expertises, skills } = await this._interestsService.fetchInterests(userId);
		res.status(HttpStatus.OK).json({ success: true, message: ResponseMessage.INTERESTS_FETCHED, expertises, skills });
	});

}
