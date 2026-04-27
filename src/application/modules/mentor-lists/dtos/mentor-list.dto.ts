import type { MentorDiscoveryDto } from "../../mentor-discovery/dtos/get-mentors.dto";

export interface MentorListDto {
	id: string;
	name: string;
	description: string | null;
	mentorCount?: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface GetMentorListsInput {
	userId: string;
}

export interface GetMentorListsOutput {
	items: MentorListDto[];
}

export interface GetMentorListInput {
	userId: string;
	listId: string;
}

export interface GetMentorListOutput {
	list: MentorListDetailsDto;
}

export interface CreateMentorListInput {
	userId: string;
	name: string;
	description?: string | null;
}

export interface CreateMentorListOutput {
	list: MentorListDto;
}

export interface MentorListDetailsDto extends MentorListDto {
	mentors: MentorDiscoveryDto[];
}

export interface AddMentorToListInput {
	userId: string;
	listId: string;
	mentorId: string;
}

export interface RemoveMentorFromListInput {
	userId: string;
	listId: string;
	mentorId: string;
}

export interface DeleteMentorListInput {
	userId: string;
	listId: string;
}
