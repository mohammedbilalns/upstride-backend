import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IMentorService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import {
  approveMentorSchema,
  fetchMentorsByExpertiseAndSkillSchema,
  mentorRegistrationSchema,
  rejectMentorSchema,
  updateMentorSchema,
} from "../validations/mentor.validation";
import { paginationQuerySchema } from "../validations/pagination.validation";

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

  fetchMentors = asyncHandler(async (req, res) => {
    const { page, limit, query } = paginationQuerySchema.parse(req.query);
    const mentors = await this._mentorService.fetchMentors({
      page,
      limit,
      query,
    });
    res.status(HttpStatus.OK).json({ success: true, data: mentors });
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
    const { mentorId } = rejectMentorSchema.parse(req.body);
    await this._mentorService.rejectMentor({ mentorId });
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: ResponseMessage.MENTOR_REJECTED });
  });
}
