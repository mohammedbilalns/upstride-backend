import { IBaseRepository } from "./base.repository.interface";
import { User } from "../entities/user.entity";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findAll(page: number, limit: number, query?: string): Promise<User[]>;
}
