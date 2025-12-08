import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IFetchInterestsUC } from "../../../domain/useCases/userInterestManagement/fetchInterests.uc.interface";
import asyncHandler from "../utils/asyncHandler";

export class InterestsController {
	constructor(private _fetchInterestsUC: IFetchInterestsUC) {}

	public fetchInterests = asyncHandler(async (_req, res) => {
		const { userId } = res.locals.user.id;
		const { expertises, skills } = await this._fetchInterestsUC.execute(userId);
		res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.INTERESTS_FETCHED,
			expertises,
			skills,
		});
	});
}
