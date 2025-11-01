import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type { IMentorService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
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
	constructor(private _mentorService: IMentorService) {}

	createMentor = asyncHandler(async (req, res) => {
		const data = mentorRegistrationSchema.parse(req.body);
		const userId = res.locals.user.id;
		await this._mentorService.createMentor({ ...data, userId });
		res
			.status(HttpStatus.CREATED)
			.json({ success: true, message: ResponseMessage.REQUEST_FOR_MENTORING });
	});

	fetchMentors = asyncHandler(async (req, res) => {
		const { page, limit, query, status } = fetchMentorsQuerySchema.parse(
			req.query,
		);
		const data = await this._mentorService.fetchMentors({
			page,
			limit,
			query,
			status,
		});
		res.status(HttpStatus.OK).json(data);
	});

	fetchMentorsForUser = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { page, limit, query, expertiseId, skillId } =
			fetchMentorsByExpertiseAndSkillSchema.parse(req.query);
		const data = await this._mentorService.findByExpertiseandSkill({
			expertiseId,
			skillId,
			userId,
			page,
			limit,
			query,
		});
		res.status(HttpStatus.OK).send(data);
	});

	appoveMentor = asyncHandler(async (req, res) => {
		const { mentorId } = approveMentorSchema.parse(req.body);
		await this._mentorService.approveMentor({ mentorId });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.MENTOR_APPROVED });
	});

	rejectMentor = asyncHandler(async (req, res) => {
		const { mentorId, rejectionReason } = rejectMentorSchema.parse(req.body);
		await this._mentorService.rejectMentor({ mentorId, rejectionReason });
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.MENTOR_REJECTED });
	});

	getMentor = asyncHandler(async (_req, res) => {
		const userId = res.locals.user.id;
		const mentor = await this._mentorService.getMentor(userId);
		res.status(HttpStatus.OK).json({ success: true, mentor });
	});

	updateMentor = asyncHandler(async (req, res) => {
		const data = updateMentorSchema.parse(req.body);
		const userId = res.locals.user.id;
		await this._mentorService.updateMentor({
			...data,
			userId,
		});
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.UPDATED_MENTOR });
	});

	// update to fetch the mentors by userInterest later
	fetchMentorsByExpertiseId = asyncHandler(async (req, res) => {
		const { expertiseId } = req.params;
		const mentors =
			await this._mentorService.getMentorByExpertiseId(expertiseId);
		res.status(HttpStatus.OK).json(mentors);
	});

	fetchMentorDetails = asyncHandler(async (req, res) => {
		const { mentorId } = fetchMentorParamsSchema.parse(req.params);
		const mentor = await this._mentorService.getMentorDetails(mentorId);
		res.status(HttpStatus.OK).json(mentor);
	});
}
