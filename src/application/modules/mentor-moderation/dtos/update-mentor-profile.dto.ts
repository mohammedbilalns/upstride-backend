import type { SkillLevel } from "../../../../domain/entities/user.entity";

export interface UpdateMentorProfileInput {
	userId: string;
	currentRoleId?: string;
	organization?: string;
	areasOfExpertise?: string[];
	currentPricePer30Min?: number;
	bio?: string;
	educationalQualifications?: string[];
	addSkills?: {
		skillId: string;
		level: SkillLevel;
	}[];
	removeSkills?: string[];
	addEducationalQualifications?: string[];
}

export interface UpdateMentorProfileResponse {
	profile: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
		bio: string;
		organization: string;
		currentRole: {
			id: string;
			name: string;
		};
		personalWebsite: string | null;
		educationalQualifications: string[];
		expertises: {
			id: string;
			name: string;
		}[];
		skills: {
			id: string;
			name: string;
			level: string;
		}[];
		tierName: string | null;
		tierMax30minPayment: number | null;
		currentPricePer30Min: number | null;
		mentorSessionEarningPercentage: number;
	};
}
