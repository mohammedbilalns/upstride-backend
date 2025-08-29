import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { IMentorService } from "../../../domain/services";
import asyncHandler from "../utils/asyncHandler";
import {
  createMentorSchema,
  fetchMentorsSchema,
  updateMentorStatusSchema,
} from "../validations/mentor.validation";

export class MentorController {
  constructor(private _mentorService: IMentorService) {}

  createMentor = asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const data = createMentorSchema.parse(req.body);
    await this._mentorService.createMentor({ userId, ...data });
    return res
      .status(HttpStatus.OK)
      .json({ success: true, message: ResponseMessage.MENTOR_REQUEST_SENT });
  });

  approveMentor = asyncHandler(async (req, res) => {
    const data = updateMentorStatusSchema.parse(req.body);
    await this._mentorService.updateMentorStatus(data);
    return res
      .status(HttpStatus.OK)
      .json({ success: true, message: ResponseMessage.MENTOR_APPROVED });
  });

  fetchMentors = asyncHandler(async (req, res) => {
    const data = fetchMentorsSchema.parse(req.params);
    await this._mentorService.fetchMentors({
      ...data,
      userRole: res.locals.user.role,
    });
    return res.status(HttpStatus.OK).json({ success: true, data });
  });
}
