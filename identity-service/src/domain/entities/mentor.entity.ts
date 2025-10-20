export interface Mentor {
	id: string;
	userId: string;
	bio: string;
	currentRole: string;
	organisation?: string;
	yearsOfExperience: number;
	educationalQualifications: string[];
	personalWebsite?: string;
	expertiseId: string;
	skillIds: string[];
	resumeId: string;
	isPending: boolean;
	isRejected: boolean;
	rejectionReason?: string;
	blockingReason?: string;
	termsAccepted: boolean;
	followers: number;
	isActive: boolean;
}
