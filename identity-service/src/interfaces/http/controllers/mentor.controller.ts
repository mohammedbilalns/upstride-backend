import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IMentorService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import {
  approveMentorSchema,
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
    const { page, limit, query, status } = fetchMentorsQuerySchema.parse(req.query);
    const data = await this._mentorService.fetchMentors({
      page,
      limit,
      query,
			status
    });
    res.status(HttpStatus.OK).json(data);
  });

  fetchMentorsByExpertiseAndSkill = asyncHandler(async (req, res) => {
    const { page, limit, query, expertiseId, skillId } =
      fetchMentorsByExpertiseAndSkillSchema.parse(req.query);
    const mentors = await this._mentorService.findByExpertiseandSkill({
      page,
      limit,
      query,
      expertiseId,
      skillId,
    });
    res.status(HttpStatus.OK).json({ success: true, data: mentors });
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

  updateMentor = asyncHandler(async (req, res) => {
    const {
      bio,
      currentRole,
      institution,
      yearsOfExperience,
      educationalQualifications,
      personalWebsite,
      resumeUrl,
      skillIds,
      expertiseId,
    } = updateMentorSchema.parse(req.body);
    const userId = res.locals.user.id;
    await this._mentorService.updateMentor({
      userId,
      bio,
      currentRole,
      institution,
      yearsOfExperience,
      educationalQualifications,
      personalWebsite,
      resumeUrl,
      skillIds,
      expertiseId,
    });
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: ResponseMessage.UPDATED_MENTOR });
  });
}
