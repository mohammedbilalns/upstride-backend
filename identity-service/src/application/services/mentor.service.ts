import { IMentorRepository, IUserRepository } from "../../domain/repositories";
import { IMentorService } from "../../domain/services";
import {
  MentorRegistrationDTO,
  updateMentoDto,
  findByExpertiseandSkillDto,
  approveMentorDto,
  rejectMentorDto,
  findAllMentorsDto,
  findAllMentorsResponseDto,
} from "../dtos/mentor.dto";
import { Mentor } from "../../domain/entities";
import { AppError } from "../errors/AppError";
import { ErrorMessage, HttpStatus, QueueEvents } from "../../common/enums";
import { IEventBus } from "../../domain/events/IEventBus";

export class MentorService implements IMentorService {
  constructor(
    private _mentorRepository: IMentorRepository,
    private _userRepository: IUserRepository,
    private _eventBus: IEventBus,
  ) {}

  async createMentor(createMentorDto: MentorRegistrationDTO): Promise<void> {
    const {
      userId,
      bio,
      currentRole,
      organisation,
      yearsOfExperience,
      educationalQualifications,
      personalWebsite,
      resume,
      termsAccepted,
      skills,
      expertise,
    } = createMentorDto;

    const user = await this._userRepository.findById(userId);
    if (!user || !user.isVerified)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    if (user.isRequestedForMentoring === "approved") {
      throw new AppError(
        ErrorMessage.MENTOR_ALREADY_APPROVED,
        HttpStatus.BAD_REQUEST,
      );
    }
    const mentorDetails = {
      bio,
      currentRole,
      organisation,
      yearsOfExperience,
      educationalQualifications,
      personalWebsite,
      resumeId: resume.public_id,
      expertiseId: expertise,
      userId,
      termsAccepted,
      skillIds: skills,
      expertise,
    };
    const [mentor, _] = await Promise.all([
      this._mentorRepository.create({ ...mentorDetails, isPending: true }),
      this._userRepository.update(userId, {
        isRequestedForMentoring: "pending",
      }),
    ]);
    await this._eventBus.publish(QueueEvents.SAVE_MEDIA, {
      ...resume,
      userId,
      mentorId: mentor.id,
      category: "resume",
    });
  }

  async updateMentor(updateMentorDto: updateMentoDto): Promise<void> {
    const { userId, ...rest } = updateMentorDto;
    await this._mentorRepository.update(userId, rest);
  }

  async fetchMentors(
    fetchMentorDto: findAllMentorsDto,
  ): Promise<findAllMentorsResponseDto> {
    const { page, limit, query, status } = fetchMentorDto;

    const [mentors, totalMentos, totalPending, totalApproved, totalRejected] =
      await Promise.all([
        this._mentorRepository.findAll({
          page,
          limit,
          query,
          status,
        }),
        this._mentorRepository.count(query, status),
        this._mentorRepository.count(query, "pending"),
        this._mentorRepository.count(query, "approved"),
        this._mentorRepository.count(query, "rejected"),
      ]);

    return {
      mentors,
      totalMentors: totalMentos,
      totalPending,
      totalApproved,
      totalRejected,
    };
  }

  async findByExpertiseandSkill(
    findByExpertiseandSkillDto: findByExpertiseandSkillDto,
  ): Promise<Mentor[]> {
    const { page, limit, query, expertiseId, skillId } =
      findByExpertiseandSkillDto;
    const mentors = await this._mentorRepository.findByExpertiseandSkill(
      expertiseId,
      skillId,
      page,
      limit,
      query,
    );
    return mentors;
  }

  async approveMentor(aproveMentorDto: approveMentorDto): Promise<void> {
    const mentor = await this._mentorRepository.findById(
      aproveMentorDto.mentorId,
    );
    if (!mentor)
      throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);

    await Promise.all([
      this._userRepository.update(mentor.userId, {
        isRequestedForMentoring: "approved",
      }),
      this._mentorRepository.update(mentor.id, {
        isPending: false,
        isRejected: false,
        isActive: true,
      }),
    ]);
  }

  async rejectMentor(rejectMentorDto: rejectMentorDto): Promise<void> {
    const { rejectionReason, mentorId } = rejectMentorDto;
    console.log("reason", rejectionReason);
    console.log("mentor id", mentorId);
    const mentor = await this._mentorRepository.findById(mentorId);
    if (!mentor)
      throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);

    await Promise.all([
      this._userRepository.update(mentor.userId, {
        isRequestedForMentoring: "rejected",
      }),
      this._mentorRepository.update(mentor.id, {
        isActive: false,
        isRejected: true,
        isPending: false,
        rejectionReason,
      }),
    ]);
  }
}
