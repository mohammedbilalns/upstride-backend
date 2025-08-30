import {
  createMentorDto,
  fetchMentorsDto,
  updateMentorDto,
  updateMentorStatusDto,
} from "../../application/dtos";

export interface IMentorService {
  createMentor(data: createMentorDto): Promise<void>;
  updateMentor(data: updateMentorDto): Promise<void>;
  updateMentorStatus(data: updateMentorStatusDto): Promise<void>;
  fetchMentors(data: fetchMentorsDto): Promise<any>;
}
