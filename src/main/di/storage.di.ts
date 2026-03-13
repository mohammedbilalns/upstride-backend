import type { Container } from "inversify";
import {
	DeleteFileUseCase,
	GetPreSignedUploadUrlUseCase,
} from "../../application/storage-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerStorageBindings = (container: Container): void => {
	// usecases
	container
		.bind(TYPES.UseCases.GetPreSignedUploadUrl)
		.to(GetPreSignedUploadUrlUseCase);
	container.bind(TYPES.UseCases.DeleteFile).to(DeleteFileUseCase);
};
