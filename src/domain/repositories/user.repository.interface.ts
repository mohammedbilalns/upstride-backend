import { User, UserRole } from "../entities/user.entity";
import { CreatableRepository } from "./capabilities/creatable.repository.interface";
import { FindByIdRepository } from "./capabilities/find-by-id.repository.interface";
import { PaginatableRepository } from "./capabilities/paginatable.repository.interface";
import { UpdatableByIdRepository } from "./capabilities/updatable-by-id.repository.interface";

export interface UserQuery {
	role?: UserRole;
	isBlocked?: boolean;
	search?: string;
}

export interface UserRepository
	extends FindByIdRepository<User>,
		CreatableRepository<User>,
		UpdatableByIdRepository<User>,
		PaginatableRepository<User, UserQuery> {
	findByEmail(email: string): Promise<User | null>;
}
