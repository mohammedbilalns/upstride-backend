export const TYPES = {
	Services: {
		PasswordHasher: Symbol.for("PasswordHasher"),
		TokenService: Symbol.for("TokenService"),
	},
	Repositories: {
		UserRepository: Symbol.for("UserRepository"),
	},
	UseCases: {
		LoginWithEmail: Symbol.for("LoginWithEmailUseCase"),
	},
};
