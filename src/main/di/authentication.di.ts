import type { Container } from "inversify";
import { AuthSessionService } from "../../application/modules/authentication/services";
import {
	GetActiveSessionsUseCase,
	GetMeUseCase,
	LoginWithEmailUseCase,
	LogoutUseCase,
	RefreshSessionUseCase,
	RegisterWithEmailUseCase,
	RequestPasswordResetUseCase,
	ResendOtpUseCase,
	RevokeAllOtherSessionsUseCase,
	RevokeSessionUseCase,
	SaveUserInterestsUseCase,
	SocialLoginUseCase,
	UpdatePasswordUseCase,
	VerifyOtpUseCase,
} from "../../application/modules/authentication/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerAuthenticationBindings = (container: Container): void => {
	//Services
	container.bind(TYPES.Services.AuthSession).to(AuthSessionService);

	//UseCases
	container.bind(TYPES.UseCases.LoginWithEmail).to(LoginWithEmailUseCase);
	container.bind(TYPES.UseCases.SocialLogin).to(SocialLoginUseCase);
	container.bind(TYPES.UseCases.RegisterWithEmail).to(RegisterWithEmailUseCase);
	container
		.bind(TYPES.UseCases.RequestPasswordReset)
		.to(RequestPasswordResetUseCase);
	container.bind(TYPES.UseCases.UpdatePassword).to(UpdatePasswordUseCase);
	container.bind(TYPES.UseCases.VerifyOtp).to(VerifyOtpUseCase);
	container.bind(TYPES.UseCases.ResendOtp).to(ResendOtpUseCase);
	container.bind(TYPES.UseCases.RefreshSession).to(RefreshSessionUseCase);
	container.bind(TYPES.UseCases.Logout).to(LogoutUseCase);
	container.bind(TYPES.UseCases.RevokeSession).to(RevokeSessionUseCase);
	container
		.bind(TYPES.UseCases.RevokeAllOtherSessions)
		.to(RevokeAllOtherSessionsUseCase);
	container.bind(TYPES.UseCases.SaveUserInterests).to(SaveUserInterestsUseCase);
	container.bind(TYPES.UseCases.GetMe).to(GetMeUseCase);
	container.bind(TYPES.UseCases.GetActiveSessions).to(GetActiveSessionsUseCase);
};
