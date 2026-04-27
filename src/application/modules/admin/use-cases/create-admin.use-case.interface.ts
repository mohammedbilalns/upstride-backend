import type {
	CreateAdminInput,
	CreateAdminOutput,
} from "../dtos/create-admin.dto";

export interface ICreateAdminUseCase {
	execute(input: CreateAdminInput): Promise<CreateAdminOutput>;
}
