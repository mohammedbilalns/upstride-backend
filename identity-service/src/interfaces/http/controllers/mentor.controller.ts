import { HttpStatus, ResponseMessage } from "../../../common/enums";
import {
	IApproveMentorUC,
	IFetchMentorByExpertiseUC,
	IFetchMentorDetailsUC,
	IFetchMentorsUC,
	IFetchSelfUC,
	IFindMentorByExpertiseandSkillUC,
	IRegisterAsMentorUC,
	IRejectMentorUC,
	IUpdateMentorUC,
} from "../../../domain/useCases/mentorManagement";
import asyncHandler from "../utils/async-handler";
import {
	approveMentorSchema,
	fetchMentorParamsSchema,
	fetchMentorsByExpertiseAndSkillSchema,
	fetchMentorsQuerySchema,
	mentorRegistrationSchema,
	rejectMentorSchema,
	updateMentorSchema,
} from "../validations/mentor.validation";

export class MentorController {
	constructor(
		private _registerAsMentorUC: IRegisterAsMentorUC,
		private _fetchMentorsUC: IFetchMentorsUC,
		private _findMentorByExpertiseandSkillUC: IFindMentorByExpertiseandSkillUC,
		private _approveMentorUC: IApproveMentorUC,
		private _rejectMentorUC: IRejectMentorUC,
		private _updateMentorUC: IUpdateMentorUC,
		private _fetchMentorByExpertiseUC: IFetchMentorByExpertiseUC,
		private _fetchMentorDetailsUC: IFetchMentorDetailsUC,
		private _fetchSelfUC: IFetchSelfUC,
	) {}

	public createMentor = asyncHandler(async (req, res) => {
		const data = mentorRegistrationSchema.parse(req.body);
		const userId = res.locals.user.id;
		await this._registerAsMentorUC.execute({ ...data, userId });
		res
			.status(HttpStatus.CREATED)
			.json({ success: true, message: ResponseMessage.REQUEST_FOR_MENTORING });
	});

	public fetchMentors = asyncHandler(async (req, res) => {
		const { page, limit, query, status } = fetchMentorsQuerySchema.parse(
			req.query,
		);
		const data = await this._fetchMentorsUC.execute({
			page,
			limit,
			query,
			status,
		});
		res.status(HttpStatus.OK).json(data);
	});

	public fetchMentorsForUser = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { page, limit, query, expertiseId, skillId } =
			fetchMentorsByExpertiseAndSkillSchema.parse(req.query);
		const data = await this._findMentorByExpertiseandSkillUC.execute({
			expertiseId,
			skillId,
			userId,
			page,
			limit,
			query,
		});
		res.status(HttpStatus.OK).send(data);
	});

	public appoveMentor = asyncHandler(async (req, res) => {
		const { mentorId } = approveMentorSchema.parse(req.body);
		await this._approveMentorUC.execute({ mentorId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.MENTOR_APPROVED });
	});

	public rejectMentor = asyncHandler(async (req, res) => {
		const { mentorId, rejectionReason } = rejectMentorSchema.parse(req.body);
		await this._rejectMentorUC.execute({ mentorId, rejectionReason });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.MENTOR_REJECTED });
	});

	public updateMentor = asyncHandler(async (req, res) => {
		const data = updateMentorSchema.parse(req.body);
		const userId = res.locals.user.id;
		await this._updateMentorUC.execute({
			...data,
			userId,
		});
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.UPDATED_MENTOR });
	});

	// update to fetch the mentors by userInterest later
	public fetchMentorsByExpertiseId = asyncHandler(async (req, res) => {
		const { expertiseId } = req.params;
		const mentors = await this._fetchMentorByExpertiseUC.execute(expertiseId);
		res.status(HttpStatus.OK).json(mentors);
	});

	public fetchMentorDetails = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { mentorId } = fetchMentorParamsSchema.parse(req.params);
		const mentor = await this._fetchMentorDetailsUC.execute(mentorId, userId);
		res.status(HttpStatus.OK).json(mentor);
	});

	public getMe = asyncHandler(async (_req, res) => {
		const userId = res.locals.user.id;
		const data = await this._fetchSelfUC.execute(userId);
		res.status(HttpStatus.OK).send(data);
	});
}
