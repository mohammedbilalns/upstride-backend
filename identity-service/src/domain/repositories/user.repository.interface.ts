import { IBaseRepository } from "./base.repository.interface";
import { User } from "../entities/user.entity";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmailAndRole(email: string, role: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(
    page: number,
    limit: number,
    allowedRoles: string[],
    query?: string,
  ): Promise<User[]>;
  count(allowedRoles: string[]): Promise<number>;
}
