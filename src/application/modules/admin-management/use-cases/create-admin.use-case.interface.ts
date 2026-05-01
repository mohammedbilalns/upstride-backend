import type { CreateAdminInput, CreateAdminOutput } from "../dtos";

export interface ICreateAdminUseCase {
	execute(input: CreateAdminInput): Promise<CreateAdminOutput>;
}
