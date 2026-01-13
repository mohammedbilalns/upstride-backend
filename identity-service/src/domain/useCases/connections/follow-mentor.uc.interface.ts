import type { FollowMentorDto } from "../../../application/dtos/connection.dto";

export interface IFollowMentorUC {
	execute(dto: FollowMentorDto): Promise<void>;
}
