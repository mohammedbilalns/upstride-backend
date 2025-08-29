export interface IMentorService {
  createMentor(
    userId: string,
    bio: string,
    currentRole: string,
    institution: string,
    yearsOfExperience: number,
    educationalQualifications: string[],
    personalWebsite: string,
    expertiseId: string,
    skillIds: string[],
    resumeUrl: string,
    termsAccepted: boolean,
  ): Promise<void>;

  updateMentor(
    id: string,
    userId: string,
    bio: string,
    currentRole: string,
    institution: string,
    yearsOfExperience: number,
    educationalQualifications: string[],
    personalWebsite: string,
    expertiseId: string,
    skillIds: string[],
    resumeUrl: string,
    termsAccepted: boolean,
  ): Promise<void>;

  fetchMentors(
    page: number,
    limit: number,
    query: string,
    expertiseId: string,
    skillIds: string[],
  ): Promise<any>;
}
