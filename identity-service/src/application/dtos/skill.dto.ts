import { UserRole } from "../../common/enums/userRoles";

export interface createSkillDto {
  name: string;
  expertiseId: string;
  userRole: UserRole;
}

export interface updateSkillDto {
  skillId: string;
  name?: string;
  isVerified?: boolean;
}

export interface fetchSkillsDto {
  expertiseId: string;
  page?: number;
  limit?: number;
  query?: string;
  userRole: UserRole;
}
