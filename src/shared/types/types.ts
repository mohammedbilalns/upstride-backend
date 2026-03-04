export const TYPES = {
	Services: {
		Hasher: Symbol.for("Hasher"),
		TokenService: Symbol.for("TokenService"),
		MailService: Symbol.for("MailService"),
		OtpGenerator: Symbol.for("OtpGenerator"),
	},
	Queues: {
		MailQueue: Symbol.for("MailQueue"),
	},
	Repositories: {
		UserRepository: Symbol.for("UserRepository"),
		OtpRepository: Symbol.for("OtpRepository"),
		SessionRepository: Symbol.for("SessionRepository"),
		TokenRevocationRepository: Symbol.for("TokenRevocationRepository"),
	},
	Databases: {
		Redis: Symbol.for("Redis"),
	},
	UseCases: {
		LoginWithEmail: Symbol.for("LoginWithEmailUseCase"),
		RequestPasswordReset: Symbol.for("RequestPasswordResetUseCase"),
		RegisterWithEmail: Symbol.for("RegisterWithEmailUseCase"),
		VerifyOtp: Symbol.for("VerifyOtpUseCase"),
		ResendOtp: Symbol.for("ResendOtpUseCase"),
		ChangePassword: Symbol.for("ChangePasswordUseCase"),
		RefreshSession: Symbol.for("RefreshSessionUseCase"),
		Logout: Symbol.for("LogoutUseCase"),
		RevokeSession: Symbol.for("RevokeSessionUseCase"),
		RevokeAllOtherSessions: Symbol.for("RevokeAllOtherSessionsUseCase"),
		SaveUserInterests: Symbol.for("SaveUserInterestsUseCase"),
	},
};
