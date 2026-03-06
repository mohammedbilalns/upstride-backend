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
		name: string;
	}[];
	skillsDetails: {
		skillId: {
			name: string;
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
	approve(id: string): Promise<Mentor | null>;
	reject(id: string, reason: string): Promise<Mentor | null>;
	paginate(
		params: PaginateParams<MentorQuery>,
	): Promise<PaginatedResult<MentorApplicationDetails>>;
}
