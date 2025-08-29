import { UserRole } from "../../common/enums/userRoles";

export interface updateMentorDto {
  mentorId: string;
  bio: string;
  currentRole: string;
  institution: string;
  yearsofExperience: number;
  educationalQualifications: string[];
  personalWebsite: string;
  skillIds: string[];
  resumeUrl: string;
}

export interface createMentorDto {
  userId: string;
  bio: string;
  currentRole: string;
  institution: string;
  yearsofExperience: number;
  educationalQualifications: string[];
  personalWebsite?: string;
  expertiseId: string;
  skillIds: string[];
  resumeUrl?: string;
  termsAccepted: boolean;
}

export interface updateMentorStatusDto {
  mentorId: string;
  isAccepted?: boolean;
  isRejected?: boolean;
}

export interface fetchMentorsDto {
  userRole: UserRole;
  page: number;
  limit: number;
  query?: string;
  expertiseId: string;
  skillIds?: string[];
}
