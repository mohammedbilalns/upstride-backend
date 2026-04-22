import type { Container } from "inversify";
import {
	DeleteFileUseCase,
	GetPreSignedUploadUrlUseCase,
} from "../../application/modules/storage/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerStorageBindings = (container: Container): void => {
	// usecases
	container
		.bind(TYPES.UseCases.GetPreSignedUploadUrl)
		.to(GetPreSignedUploadUrlUseCase)
		.inSingletonScope();
	container
		.bind(TYPES.UseCases.DeleteFile)
		.to(DeleteFileUseCase)
		.inSingletonScope();
};
