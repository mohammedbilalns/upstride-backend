import type { Mentor } from "../entities/mentor.entity";
import type { CreatableRepository } from "./capabilities/creatable.repository.interface";
import type { FindByIdRepository } from "./capabilities/find-by-id.repository.interface";
import type { PaginatableRepository } from "./capabilities/paginatable.repository.interface";
import type { UpdatableByIdRepository } from "./capabilities/updatable-by-id.repository.interface";

export interface MentorQuery {
	isApproved?: boolean;
	userId?: string;
}

export interface IMentorRepository
	extends FindByIdRepository<Mentor>,
		CreatableRepository<Mentor>,
		UpdatableByIdRepository<Mentor>,
		PaginatableRepository<Mentor, MentorQuery> {
	findByUserId(userId: string): Promise<Mentor | null>;
	updateStatus(
		id: string,
		isApproved: boolean,
		rejectionReason?: string | null,
	): Promise<Mentor | null>;
}
