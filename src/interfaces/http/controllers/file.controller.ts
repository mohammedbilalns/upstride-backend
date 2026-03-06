import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { DeleteFileUseCase } from "../../../application/storage-management/use-cases/delete-file.usecase";
import type { GetPreSignedUploadUrlUseCase } from "../../../application/storage-management/use-cases/get-presigned-upload-url.usecase";
import { HttpStatus } from "../../../shared/constants";
import { SuccessMessage } from "../../../shared/constants/responses-messages";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler } from "../helpers";
import { sendSuccess } from "../helpers/response";
import {
	deleteFileSchema,
	getPreSignedUploadUrlSchema,
} from "../validators/file.validator";

@injectable()
export class FileController {
	constructor(
		@inject(TYPES.UseCases.GetPreSignedUploadUrl)
		private readonly getPreSignedUploadUrlUseCase: GetPreSignedUploadUrlUseCase,
		@inject(TYPES.UseCases.DeleteFile)
		private readonly deleteFileUseCase: DeleteFileUseCase,
	) {}

	getPreSignedUploadUrl = asyncHandler(async (req: Request, res: Response) => {
		const payload = getPreSignedUploadUrlSchema.parse(req.body);

		const result = await this.getPreSignedUploadUrlUseCase.execute(payload);

		return sendSuccess(res, HttpStatus.OK, {
			message: SuccessMessage.FILE.PRESIGNED_URL_GENERATED,
			data: result,
		});
	});

	deleteFile = asyncHandler(async (req: Request, res: Response) => {
		const { key } = deleteFileSchema.parse(req.body);

		await this.deleteFileUseCase.execute(key);

		return sendSuccess(res, HttpStatus.OK, {
			message: SuccessMessage.FILE.DELETED,
		});
	});
}
