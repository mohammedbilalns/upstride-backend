import type { LoginResponse, SocialLoginInput } from "../../dtos";

export interface ISocialLoginUseCase {
	execute(input: SocialLoginInput): Promise<LoginResponse>;
}
