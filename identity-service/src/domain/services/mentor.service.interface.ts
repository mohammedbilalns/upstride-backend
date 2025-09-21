import {
  MentorRegistrationDTO,
  updateMentoDto,
  findByExpertiseandSkillDto,
  approveMentorDto,
  rejectMentorDto,
  findAllMentorsDto,
  findAllMentorsResponseDto,
} from "../../application/dtos/mentor.dto";
import { Mentor } from "../entities";

export interface IMentorService {
  createMentor(createMentorDto: MentorRegistrationDTO): Promise<void>;
  updateMentor(updateMentorDto: updateMentoDto): Promise<void>;
  fetchMentors(
    fetchMentorDto: findAllMentorsDto,
  ): Promise<findAllMentorsResponseDto>;
  findByExpertiseandSkill(
    findByExpertiseandSkillDto: findByExpertiseandSkillDto,
  ): Promise<Mentor[]>;
  approveMentor(aproveMentorDto: approveMentorDto): Promise<void>;
  rejectMentor(rejectMentorDto: rejectMentorDto): Promise<void>;
}
