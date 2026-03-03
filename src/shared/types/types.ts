export const TYPES = {
	Services: {
		PasswordHasher: Symbol.for("PasswordHasher"),
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
	},
	Databases: {
		Redis: Symbol.for("Redis"),
	},
	UseCases: {
		LoginWithEmail: Symbol.for("LoginWithEmailUseCase"),
		RequestPasswordReset: Symbol.for("RequestPasswordResetUseCase"),
		RegisterWithEmail: Symbol.for("RegisterWithEmailUseCase"),
	},
};
