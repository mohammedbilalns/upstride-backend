import { inject, injectable } from "inversify";
import type { DeleteFileUseCase } from "../../../application/storage-management/use-cases/delete-file.usecase";
import type { GetPreSignedUploadUrlUseCase } from "../../../application/storage-management/use-cases/get-presigned-upload-url.usecase";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { FileResponseMessages } from "../constants/response-messages";
import { asyncHandler } from "../helpers";
import { sendSuccess } from "../helpers/response";
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
