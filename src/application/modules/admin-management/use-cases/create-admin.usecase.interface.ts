import type { CreateAdminInput } from "../dtos/create-admin.dto";

export interface ICreateAdminUseCase {
	execute(input: CreateAdminInput): Promise<void>;
}
