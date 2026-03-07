import type { UserRole } from "../../domain/entities/user.entity";
export interface SessionUser {
	id: string;
	role: UserRole;
	sid: string;
}
