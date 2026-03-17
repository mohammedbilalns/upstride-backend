import { inject, injectable } from "inversify";
import {
	AuthTypeValues,
	type User,
	UserRoleValues,
} from "../../../domain/entities/user.entity";
import type { IUserRepository } from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import { UserAlreadyExistsError } from "../../authentication/errors/user-already-exists.error";
import type { IPasswordService } from "../../services/password.service.interface";
import type { CreateAdminInput } from "../dtos/create-admin.dto";
import type { ICreateAdminUseCase } from "./create-admin.usecase.interface";

@injectable()
export class CreateAdminUseCase implements ICreateAdminUseCase {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private _userRepository: IUserRepository,
		@inject(TYPES.Services.Password)
		private _passwordService: IPasswordService,
	) {}

	async execute(input: CreateAdminInput): Promise<void> {
		const existingUser = await this._userRepository.findByEmail(input.email);

		if (existingUser?.isVerified) throw new UserAlreadyExistsError();

		if (existingUser?.isVerified === false) {
			await this._userRepository.deleteById(existingUser.id);
		}

		const hashedPassword = await this._passwordService.hashPassword(
			input.password,
		);

		const nameFromEmail = input.email.split("@")[0]?.trim() || "Admin";

		const newUser = {
			name: nameFromEmail,
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

		await this._userRepository.create(newUser);
	}
}
