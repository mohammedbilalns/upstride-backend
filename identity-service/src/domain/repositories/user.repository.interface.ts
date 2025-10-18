import type { User } from "../entities/user.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IUserRepository extends IBaseRepository<User> {
	findByEmailAndRole(email: string, role: string): Promise<User | null>;
	finddByIdAndRole(id: string, role: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findAll(
		page: number,
		limit: number,
		allowedRoles: string[],
		query?: string,
	): Promise<User[]>;
	count(allowedRoles: string[]): Promise<number>;
	findByIds(ids: string[]): Promise<User[]>;
	findByUserId(userId: string): Promise<User | null>;
}
