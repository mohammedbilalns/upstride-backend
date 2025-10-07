export interface IVerificationTokenRepository {
	saveOtp(
		otp: string,
		email: string,
		type: string,
		expiryInSeconds: number,
	): Promise<void>;
	getOtp(email: string, type: string): Promise<string | null>;
	deleteOtp(email: string, type: string): Promise<void>;
	existsOtp(email: string, type: string): Promise<boolean>;
	resetOtp(
		otp: string,
		email: string,
		type: string,
		expiryInSeconds: number,
	): Promise<void>;
	getResendCount(email: string, type: string): Promise<number>;
	incrementCount(email: string, type: string): Promise<void>;
	updateOtp(otp: string, email: string, type: string): Promise<void>;
	saveToken(
		token: string,
		value: string,
		context: string,
		expiryInSeconds: number,
	): Promise<void>;
	getToken(token: string, context: string): Promise<string | null>;
	deleteToken(token: string, context: string): Promise<void>;
	tokenExists(token: string, context: string): Promise<boolean>;
}
