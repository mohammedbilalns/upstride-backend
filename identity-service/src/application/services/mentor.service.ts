import { IMentorRepository, IUserRepository } from "../../domain/repositories";
import { IMentorService } from "../../domain/services";
import {
  createMentorDto,
  updateMentoDto,
  fetchMentorDto,
  findByExpertiseandSkillDto,
  approveMentorDto,
  rejectMentorDto,
} from "../dtos/mentor.dto";
import { Mentor } from "../../domain/entities";
import { AppError } from "../errors/AppError";
import { ErrorMessage, HttpStatus } from "../../common/enums";

export class MentorService implements IMentorService {
  constructor(
    private _mentorRepository: IMentorRepository,
    private _userRepository: IUserRepository,
  ) {}

  async createMentor(createMentorDto: createMentorDto): Promise<void> {
    const user = await this._userRepository.findByEmail(createMentorDto.userId);
    if (!user || !user.isVerified)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    await Promise.all([
      this._mentorRepository.create({ ...createMentorDto, isActive: false }),
      this._userRepository.update(createMentorDto.userId, {
        isRequestedForMentoring: "pending",
      }),
    ]);
  }

  async updateMentor(updateMentorDto: updateMentoDto): Promise<void> {
    const { userId, ...rest } = updateMentorDto;
    await this._mentorRepository.update(userId, rest);
  }

  async fetchMentors(fetchMentorDto: fetchMentorDto): Promise<Mentor[]> {
    const { page, limit, query } = fetchMentorDto;
    const mentors = await this._mentorRepository.findAll(page, limit, query);
    return mentors;
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
      this._mentorRepository.update(mentor.id, { isActive: true }),
    ]);
  }

  async rejectMentor(rejectMentorDto: rejectMentorDto): Promise<void> {
    const mentor = await this._mentorRepository.findById(
      rejectMentorDto.mentorId,
    );
    if (!mentor)
      throw new AppError(ErrorMessage.MENTOR_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
