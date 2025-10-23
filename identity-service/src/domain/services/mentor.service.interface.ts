import type {
	approveMentorDto,
	findAllMentorsDto,
	findAllMentorsResponseDto,
	findByExpertiseandSkillDto,
	MentorRegistrationDTO,
	rejectMentorDto,
	updateMentoDto,
} from "../../application/dtos/mentor.dto";
import type { Mentor } from "../entities";

export interface IMentorService {
	createMentor(createMentorDto: MentorRegistrationDTO): Promise<void>;
	updateMentor(updateMentorDto: updateMentoDto): Promise<void>;
	getMentor(userId: string): Promise<Mentor>;
	fetchMentors(
		fetchMentorDto: findAllMentorsDto,
	): Promise<findAllMentorsResponseDto>;
	findByExpertiseandSkill(
		findByExpertiseandSkillDto: findByExpertiseandSkillDto,
	): Promise<{mentors: Mentor[], total: number}>;
	approveMentor(aproveMentorDto: approveMentorDto): Promise<void>;
	rejectMentor(rejectMentorDto: rejectMentorDto): Promise<void>;
	getMentorByExpertiseId(expertiseId: string): Promise<string[]>;
	getMentorDetails(mentorId: string): Promise<Mentor | null>;
}
