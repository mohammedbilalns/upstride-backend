import { inject, injectable } from "inversify";
import type {
	DeleteFileUseCase,
	GetPreSignedUploadUrlUseCase,
} from "../../../application/storage-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { FileResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";
import type {
	DeleteFileBodyPayload,
	GetPreSignedUploadUrlBody,
} from "../validators/file.validator";

@injectable()
export class FileController {
	constructor(
		@inject(TYPES.UseCases.GetPreSignedUploadUrl)
		private readonly getPreSignedUploadUrlUseCase: GetPreSignedUploadUrlUseCase,
		@inject(TYPES.UseCases.DeleteFile)
		private readonly deleteFileUseCase: DeleteFileUseCase,
	) {}

	getPreSignedUploadUrl = asyncHandler(async (req, res) => {
		const result = await this.getPreSignedUploadUrlUseCase.execute(
			req.validated?.body as GetPreSignedUploadUrlBody,
		);

		return sendSuccess(res, HttpStatus.OK, {
			message: FileResponseMessages.PRESIGNED_URL_GENERATED,
			data: result,
		});
	});

	deleteFile = asyncHandler(async (req, res) => {
		await this.deleteFileUseCase.execute(
			(req.validated?.body as DeleteFileBodyPayload).key,
		);

		return sendSuccess(res, HttpStatus.OK, {
			message: FileResponseMessages.DELETED,
		});
	});
}
