import { UserRole } from "../../common/enums/userRoles";

export interface createExpertiseDto {
  name: string;
  description: string;
  skills: string[];
}

export interface updateExpertiseDto {
  expertiseId: string;
  name?: string;
  description?: string;
  isVerified?: boolean;
}

export interface fetchExpertiseDto {
  page: number;
  limit: number;
  query: string;
  userRole: UserRole;
}
