import type { SocialLoginInput, SocialLoginResponse } from "../../dtos";

export interface ISocialLoginUseCase {
	execute(input: SocialLoginInput): Promise<SocialLoginResponse>;
}
