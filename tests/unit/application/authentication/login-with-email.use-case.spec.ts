import {
	AuthenticationError,
	UserBlockedError,
} from "../../../../src/application/modules/authentication/errors";
import {
	buildLoginDeps,
	createLoginInput,
	VALID_PASSWORD,
} from "../../../factories/auth.factory";
import {
	createUser,
	HASHED_PASSWORD,
	VALID_EMAIL,
} from "../../../factories/user.factory";

describe("LoginWithEmailUseCase", () => {
	describe("Happy path", () => {
		it("returns the login response for a valid LOCAL user with correct credentials", async () => {
			const { useCase, userRepository, passwordService, authSessionService } =
				buildLoginDeps();

			const result = await useCase.execute(createLoginInput());

			expect(result).toEqual({ accessToken: "token" });
			expect(userRepository.findByEmail).toHaveBeenCalledOnce();
			expect(userRepository.findByEmail).toHaveBeenCalledWith(VALID_EMAIL);
			expect(passwordService.verifyPassword).toHaveBeenCalledOnce();
			expect(passwordService.verifyPassword).toHaveBeenCalledWith(
				VALID_PASSWORD,
				HASHED_PASSWORD,
			);
			expect(authSessionService.createLoginResponse).toHaveBeenCalledOnce();
		});

		it("passes the full input (device context) to createLoginResponse", async () => {
			const { useCase, authSessionService } = buildLoginDeps();
			const input = createLoginInput();

			await useCase.execute(input);

			expect(authSessionService.createLoginResponse).toHaveBeenCalledWith(
				expect.objectContaining({ email: VALID_EMAIL }),
				input,
			);
		});
	});

	describe("User not found", () => {
		it("throws AuthenticationError when no user matches the email", async () => {
			const { useCase } = buildLoginDeps({
				findByEmail: vi.fn().mockResolvedValue(null),
			});

			await expect(useCase.execute(createLoginInput())).rejects.toThrow(
				AuthenticationError,
			);
		});

		it("calls fakeVerify to prevent timing-based user enumeration", async () => {
			const fakeVerify = vi.fn().mockResolvedValue(false);
			const { useCase } = buildLoginDeps({
				findByEmail: vi.fn().mockResolvedValue(null),
				fakeVerify,
			});

			await expect(useCase.execute(createLoginInput())).rejects.toThrow(
				AuthenticationError,
			);
			expect(fakeVerify).toHaveBeenCalledOnce();
		});
	});

	describe("Non-LOCAL auth type", () => {
		it("throws AuthenticationError when user registered via a social provider (e.g. GOOGLE)", async () => {
			const { useCase } = buildLoginDeps({
				findByEmail: vi
					.fn()
					.mockResolvedValue(createUser({ authType: "GOOGLE" })),
			});

			await expect(useCase.execute(createLoginInput())).rejects.toThrow(
				AuthenticationError,
			);
		});

		it("calls fakeVerify to prevent timing-based user enumeration for social users", async () => {
			const fakeVerify = vi.fn().mockResolvedValue(false);
			const { useCase } = buildLoginDeps({
				findByEmail: vi
					.fn()
					.mockResolvedValue(createUser({ authType: "GOOGLE" })),
				fakeVerify,
			});

			await expect(useCase.execute(createLoginInput())).rejects.toThrow(
				AuthenticationError,
			);
			expect(fakeVerify).toHaveBeenCalledOnce();
		});
	});

	describe("Blocked user", () => {
		it("throws UserBlockedError before checking the password", async () => {
			const verifyPassword = vi.fn();
			const { useCase } = buildLoginDeps({
				findByEmail: vi.fn().mockResolvedValue(createUser({ isBlocked: true })),
				verifyPassword,
			});

			await expect(useCase.execute(createLoginInput())).rejects.toThrow(
				UserBlockedError,
			);
			expect(verifyPassword).not.toHaveBeenCalled();
		});
	});

	describe("Unverified user", () => {
		it("throws AuthenticationError before checking the password", async () => {
			const verifyPassword = vi.fn();
			const { useCase } = buildLoginDeps({
				findByEmail: vi
					.fn()
					.mockResolvedValue(createUser({ isVerified: false })),
				verifyPassword,
			});

			await expect(useCase.execute(createLoginInput())).rejects.toThrow(
				AuthenticationError,
			);
			expect(verifyPassword).not.toHaveBeenCalled();
		});

		it("calls fakeVerify to preserve constant response time for unverified users", async () => {
			const fakeVerify = vi.fn().mockResolvedValue(false);
			const { useCase } = buildLoginDeps({
				findByEmail: vi
					.fn()
					.mockResolvedValue(createUser({ isVerified: false })),
				fakeVerify,
			});

			await expect(useCase.execute(createLoginInput())).rejects.toThrow(
				AuthenticationError,
			);
			expect(fakeVerify).toHaveBeenCalledOnce();
		});
	});

	describe("Wrong password", () => {
		it("throws AuthenticationError when the supplied password does not match the hash", async () => {
			const { useCase, passwordService } = buildLoginDeps({
				verifyPassword: vi.fn().mockResolvedValue(false),
			});

			await expect(useCase.execute(createLoginInput())).rejects.toThrow(
				AuthenticationError,
			);
			expect(passwordService.verifyPassword).toHaveBeenCalledOnce();
		});

		it("does NOT call createLoginResponse on password mismatch", async () => {
			const { useCase, authSessionService } = buildLoginDeps({
				verifyPassword: vi.fn().mockResolvedValue(false),
			});

			await expect(useCase.execute(createLoginInput())).rejects.toThrow(
				AuthenticationError,
			);
			expect(authSessionService.createLoginResponse).not.toHaveBeenCalled();
		});
	});
});
