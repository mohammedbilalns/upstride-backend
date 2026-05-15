import type { IAuthSessionService } from "../../src/application/modules/authentication/services";
import { LoginWithEmailUseCase } from "../../src/application/modules/authentication/use-cases";
import type { IPasswordService } from "../../src/application/services";
import type { IUserRepository } from "../../src/domain/repositories";
import { createUser, VALID_EMAIL } from "./user.factory";

export const VALID_PASSWORD = "correct-password";

export const createLoginInput = (
	overrides: Partial<{ email: string; password: string }> = {},
) => ({
	email: VALID_EMAIL,
	password: VALID_PASSWORD,
	...overrides,
});

export const buildLoginDeps = (
	overrides: {
		findByEmail?: ReturnType<typeof vi.fn>;
		verifyPassword?: ReturnType<typeof vi.fn>;
		fakeVerify?: ReturnType<typeof vi.fn>;
		createLoginResponse?: ReturnType<typeof vi.fn>;
	} = {},
) => {
	const userRepository = {
		findByEmail:
			overrides.findByEmail ?? vi.fn().mockResolvedValue(createUser()),
	};

	const passwordService = {
		verifyPassword: overrides.verifyPassword ?? vi.fn().mockResolvedValue(true),
		fakeVerify: overrides.fakeVerify ?? vi.fn().mockResolvedValue(false),
	};

	const authSessionService = {
		createLoginResponse:
			overrides.createLoginResponse ??
			vi.fn().mockResolvedValue({ accessToken: "token" }),
	};

	const useCase = new LoginWithEmailUseCase(
		userRepository as unknown as IUserRepository,
		passwordService as unknown as IPasswordService,
		authSessionService as unknown as IAuthSessionService,
	);

	return { userRepository, passwordService, authSessionService, useCase };
};
