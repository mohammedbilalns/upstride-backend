
export interface  createMentorDto {
	userId: string;
	bio: string;
	currentRole: string;
	institution: string;
	yearsOfExperience: number;
	educationalQualifications: string[];
	personalWebsite: string;
	resumeUrl: string;
	termsAccepted: boolean;
	skillIds: string[];
	expertiseId: string;
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
