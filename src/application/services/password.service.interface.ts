export interface IPasswordService {
	hashPassword(password: string): Promise<string>;
	verifyPassword(password: string, passwordHash: string): Promise<boolean>;
	fakeVerify(): Promise<boolean>;
}
