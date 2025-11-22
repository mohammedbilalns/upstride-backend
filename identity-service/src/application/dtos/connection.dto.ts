import type { Types } from "mongoose";
import type { Connection } from "../../domain/entities/connection.entity";

export type ConnectionsResponseDto = Connection[];

export interface Activity {
	id: string;
	activityType: "followed_user" | "followed_you";
	userName: string;
	avatarImage: string;
	createdAt?: string;
}

export interface PopulatedUser {
	_id: Types.ObjectId;
	name: string;
	profilePicture?: string;
}

export interface PopulatedMentor {
	_id: Types.ObjectId;
	userId: PopulatedUser;
	bio: string;
	currentRole: string;
	organisation: string;
	yearsOfExperience: number;
	educationalQualifications: string[];
	personalWebsite: string;
	expertiseId: Types.ObjectId;
	skillIds: Types.ObjectId[];
	resumeId: string;
	isPending: boolean;
	isRejected: boolean;
	termsAccepted: boolean;
	isActive: boolean;
	followers: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface PopulatedConnection {
	_id: Types.ObjectId;
	mentorId: PopulatedMentor;
	followerId: PopulatedUser;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface SuggestedMentor {
	id: string;
	userId: string;
	bio?: string;
	currentRole: string;
	organisation: string;
	yearsOfExperience: number;
	educationalQualifications: string[];
	personalWebsite?: string;
	expertise: {
		_id: string;
		name: string;
	};
	skills: Array<{
		_id: string;
		name: string;
	}>;
	followers: number;
	matchScore: number;
	user?: {
		id: string;
		name: string;
		profilePicture?: string;
	};
}

export interface SuggestedMentorsResponseDto {
	mentors: SuggestedMentor[];
}

export type MutualConnectionsResponseDto = {};
