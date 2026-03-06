import type { UserWithPopulatedPreferences } from "../../application/profile-management/dtos/get-profile.dto";
import type { User, UserRole } from "../entities/user.entity";
import type { CreatableRepository } from "./capabilities/creatable.repository.interface";
import type { FindByIdRepository } from "./capabilities/find-by-id.repository.interface";
import type { PaginatableRepository } from "./capabilities/paginatable.repository.interface";
import type { UpdatableByIdRepository } from "./capabilities/updatable-by-id.repository.interface";

export interface UserQuery {
	role?: UserRole | UserRole[];
	isBlocked?: boolean;
	search?: string;
}

export interface IUserRepository
	extends FindByIdRepository<User>,
		CreatableRepository<User>,
		UpdatableByIdRepository<User>,
		PaginatableRepository<User, UserQuery> {
	findByEmail(email: string): Promise<User | null>;
	findProfileById(id: string): Promise<UserWithPopulatedPreferences | null>;
	deleteById(id: string): Promise<void>;
}
