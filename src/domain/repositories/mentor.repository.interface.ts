import type { Mentor } from "../entities/mentor.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatedResult,
	PaginateParams,
	UpdatableByIdRepository,
} from "./capabilities";

export interface MentorQuery {
	isApproved?: boolean;
	isRejected?: boolean;
	userId?: string;
}

export interface MentorDiscoveryQuery {
	search?: string;
	categoryId?: string;
	tierName?: string;
	excludeUserId?: string;
	minExperience?: number;
	maxExperience?: number;
}

export interface MentorApplicationDetails extends Mentor {
	user: {
		name: string;
		email: string;
		avatar?: string;
	};
	currentRoleDetails: {
		name: string;
	};
	expertisesDetails: {
		id: string;
		name: string;
	}[];
	skillsDetails: {
		skillId: {
			name: string;
			interestId: string;
		};
		level: string;
	}[];
}

export interface MentorDiscoveryDetails extends Mentor {
	user: {
		name: string;
		profilePictureId?: string;
	};
	currentRoleDetails: {
		name: string;
	};
	categories: {
		id: string;
		name?: string;
	}[];
	skills: {
		id: string;
		name?: string;
	}[];
}

export interface MentorProfileDetails extends Mentor {
	user: {
		name: string;
		email: string;
		profilePictureId?: string;
	};
	currentRoleDetails: {
		id: string;
		name: string;
	};
	expertisesDetails: {
		id: string;
		name: string;
	}[];
	skillsDetails: {
		skillId: {
			id: string;
			name: string;
			interestId: string;
		};
		level: string;
	}[];
}

export interface IMentorRepository
	extends FindByIdRepository<Mentor>,
		CreatableRepository<Mentor>,
		UpdatableByIdRepository<Mentor> {
	findByUserId(userId: string): Promise<Mentor | null>;
	updateStatus(
		id: string,
		isApproved: boolean,
		rejectionReason?: string | null,
	): Promise<Mentor | null>;

	paginate(
		params: PaginateParams<MentorQuery>,
	): Promise<PaginatedResult<MentorApplicationDetails>>;
	paginateDiscoverable(
		params: PaginateParams<MentorDiscoveryQuery>,
	): Promise<PaginatedResult<MentorDiscoveryDetails>>;
	findProfileByUserId(userId: string): Promise<MentorProfileDetails | null>;
	findProfileById(mentorId: string): Promise<MentorProfileDetails | null>;
}
