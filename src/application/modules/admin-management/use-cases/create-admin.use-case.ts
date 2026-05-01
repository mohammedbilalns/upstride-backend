import { inject, injectable } from "inversify";
import {
	AuthTypeValues,
	type User,
	UserRoleValues,
} from "../../../../domain/entities/user.entity";
import type { IUserRepository } from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { parseNameFromEmail } from "../../../../shared/utilities/parse-name-from-email.util";
import type { IPasswordService } from "../../../services/password.service.interface";
import { UserAlreadyExistsError } from "../../authentication/errors/user-already-exists.error";
import type { CreateAdminInput, CreateAdminOutput } from "../dtos";
import type { ICreateAdminUseCase } from "./create-admin.use-case.interface";

@injectable()
export class CreateAdminUseCase implements ICreateAdminUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
		@inject(TYPES.Services.Password)
		private _passwordService: IPasswordService,
	) {}

	async execute(input: CreateAdminInput): Promise<CreateAdminOutput> {
		const existingUser = await this._userRepository.findByEmail(input.email);

		if (existingUser?.isVerified) throw new UserAlreadyExistsError();

		if (existingUser?.isVerified === false) {
			await this._userRepository.deleteById(existingUser.id);
		}

		const hashedPassword = await this._passwordService.hashPassword(
			input.password,
		);

		const newUser = {
			name: parseNameFromEmail(input.email),
			email: input.email,
			phone: "",
			coinBalance: 0,
			passwordHash: hashedPassword,
			authType: AuthTypeValues[0],
			profilePictureId: null,
			role: UserRoleValues[2],
			isBlocked: false,
			isVerified: true,
		} as User;

		const newAdmin = await this._userRepository.create(newUser);
		return { newAdminId: newAdmin.id };
	}
}
