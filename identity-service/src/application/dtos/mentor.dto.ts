export interface MentorRegistrationDTO {
  userId: string;
  bio: string;
  currentRole: string;
  organisation: string;
  yearsOfExperience: number;
  educationalQualifications: string[];
  personalWebsite?: string | "";
  expertise: string;
  skills: string[];
  resume: {
    public_id: string;
    original_filename: string;
    resource_type: string;
    secure_url: string;
    bytes: number;
    asset_folder: string;
  };
  termsAccepted: boolean;
}

export interface updateMentoDto {
  userId: string;
  bio?: string;
  currentRole?: string;
  institution?: string;
  yearsOfExperience?: number;
  educationalQualifications?: string[];
  personalWebsite?: string;
  resumeUrl?: string;
  skillIds?: string[];
  expertiseId?: string;
}

export interface fetchMentorDto {
  page: number;
  limit: number;
  query?: string;
}

export interface findByExpertiseandSkillDto {
  page: number;
  limit: number;
  query?: string;
  expertiseId: string;
  skillId: string;
}

export interface approveMentorDto {
  mentorId: string;
}

export interface rejectMentorDto {
  mentorId: string;
}
