import type { User } from "../../../../domain/entities/user.entity";
import type { AuthDeviceContext, LoginResponse } from "../dtos";

export interface IAuthSessionService {
	createLoginResponse(
		user: User,
		deviceContext: AuthDeviceContext,
	): Promise<LoginResponse>;
}
