export interface IConnectionValidationService {
	validate(userId: string, mentorId: string): Promise<false | string>;
}
