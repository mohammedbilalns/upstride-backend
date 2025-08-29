export interface Mentor {
  id: string;
  userId: string;
  bio: string;
  currentRole: string;
  institution?: string;
  yearsOfExperience: number;
  educationalQualifications: string[];
  personalWebsite?: string;
  expertiseId: string;
  skillIds: string[];
  resumeUrl?: string;
  termsAccepted: boolean;
}
