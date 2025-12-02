import { MentorDetailsDto } from "../../../application/dtos";

export interface IFetchMentorDetailsUC {
	execute(mentorId: string, userId: string): Promise<MentorDetailsDto>;
}
