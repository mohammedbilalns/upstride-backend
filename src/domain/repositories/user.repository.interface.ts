import type { User, UserRole } from "../entities/user.entity";
import type { UserWithPopulatedPreferences } from "../entities/user-preferences.entity";
import type {
	CreatableRepository,
	FindByIdRepository,
	PaginatableRepository,
	QueryableRepository,
	UpdatableByIdRepository,
} from "./capabilities";

export interface UserQuery {
	role?: UserRole | UserRole[];
	isBlocked?: boolean;
	search?: string;
	interestIds?: string[];
}

export interface IUserRepository
	extends FindByIdRepository<User>,
		CreatableRepository<User>,
		UpdatableByIdRepository<User>,
		QueryableRepository<User, UserQuery>,
		PaginatableRepository<User, UserQuery> {
	findByEmail(email: string): Promise<User | null>;
	findByGoogleId(googleId: string): Promise<User | null>;
	findByLinkedinId(linkedinId: string): Promise<User | null>;
	findProfileById(id: string): Promise<UserWithPopulatedPreferences | null>;
	deleteById(id: string): Promise<void>;
	incrementBalance(userId: string, amount: number): Promise<void>;
}
