import { createMentorDto, fetchMentorDto, updateMentoDto, findByExpertiseandSkillDto,approveMentorDto,rejectMentorDto } from "../../application/dtos/mentor.dto";
import { Mentor } from "../entities";

export interface IMentorService {
  createMentor(createMentorDto: createMentorDto): Promise<void>;
  updateMentor(updateMentorDto: updateMentoDto): Promise<void>;
  fetchMentors(fetchMentorDto: fetchMentorDto): Promise<Mentor[]>;
	findByExpertiseandSkill(findByExpertiseandSkillDto: findByExpertiseandSkillDto): Promise<Mentor[]>;
	approveMentor(aproveMentorDto: approveMentorDto): Promise<void>;
	rejectMentor(rejectMentorDto: rejectMentorDto): Promise<void>;

	}
