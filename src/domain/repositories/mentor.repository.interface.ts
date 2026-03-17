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
	tierId?: string;
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
	approve(id: string, tierId?: string | null): Promise<Mentor | null>;
	reject(id: string, reason: string): Promise<Mentor | null>;
	paginate(
		params: PaginateParams<MentorQuery>,
	): Promise<PaginatedResult<MentorApplicationDetails>>;
	paginateDiscoverable(
		params: PaginateParams<MentorDiscoveryQuery>,
	): Promise<PaginatedResult<MentorDiscoveryDetails>>;
}
