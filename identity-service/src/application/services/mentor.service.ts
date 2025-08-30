import { ErrorMessage, HttpStatus } from "../../common/enums";
import { IMenotorRepository, IUserRepository } from "../../domain/repositories";
import { IMentorService } from "../../domain/services";
import { Mentor, User } from "../../domain/entities";
import { AppError } from "../errors/AppError";

import {
  createMentorDto,
  updateMentorDto,
  updateMentorStatusDto,
  fetchMentorsDto,
} from "../dtos/mentor.dto";
import { UserRole } from "../../common/enums/userRoles";

export class MentorService implements IMentorService {
  constructor(
    private _mentorRepository: IMenotorRepository,
    private _userRepository: IUserRepository,
  ) {}
  async createMentor(data: createMentorDto): Promise<void> {
    const isUserExists = await this._userRepository.finddByIdAndRole(
      data.userId,
      UserRole.USER,
    );
    if (!isUserExists)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    await Promise.all([
      this._mentorRepository.create({ ...data }),
      this._userRepository.update(data.userId, {
        isRequestedForMentoring: "pending",
      }),
    ]);
  }

  async updateMentor(data: updateMentorDto): Promise<void> {
    const { mentorId, ...dataToUpdate } = data;
    const mentor = await this._mentorRepository.findById(mentorId);
    if (!mentor)
      throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);

    await this._mentorRepository.update(mentorId, dataToUpdate);
  }

  async updateMentorStatus(data: updateMentorStatusDto): Promise<void> {
    const mentorUpdate: Partial<Mentor> = {};
    const userUpdate: Partial<User> = {};

    if (data.isAccepted !== undefined) {
      mentorUpdate.isApproved = data.isAccepted;
      mentorUpdate.isRejected = !data.isAccepted;

      userUpdate.isRequestedForMentoring = data.isAccepted
        ? "approved"
        : "pending";
    }

    if (data.isRejected !== undefined) {
      mentorUpdate.isRejected = data.isRejected;
      mentorUpdate.isApproved = !data.isRejected;

      userUpdate.isRequestedForMentoring = data.isRejected
        ? "rejected"
        : "pending";
    }

    const mentor = await this._mentorRepository.update(
      data.mentorId,
      mentorUpdate,
    );
    if (!mentor)
      throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);

    await this._userRepository.update(mentor?.userId, userUpdate);
  }

  async fetchMentors(data: fetchMentorsDto): Promise<{
    mentors: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, query, expertiseId, skillIds, userRole } = data;

    const [mentors, total] = await Promise.all([
      this._mentorRepository.findAll(page, limit, query, expertiseId, skillIds),
      this._mentorRepository.count(query, expertiseId, skillIds),
    ]);
    const isAdmin =
      userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;

    const mappedMentors = mentors.map((mentor) => ({
      id: mentor.id,
      name: mentor.userId,
      bio: mentor.bio,
      currentRole: mentor.currentRole,
      institution: mentor.institution,
      yearsOfExperience: mentor.yearsOfExperience,
      educationalQualifications: mentor.educationalQualifications,
      personalWebsite: mentor.personalWebsite,
      expertiseId: mentor.expertiseId,
      skillIds: mentor.skillIds,
      isApproved: mentor.isApproved,
      isRejected: mentor.isRejected,
      ...(isAdmin && { resumeUrl: mentor.resumeUrl }),
    }));

    return {
      mentors: mappedMentors,
      total,
      page,
      limit,
    };
  }
}
