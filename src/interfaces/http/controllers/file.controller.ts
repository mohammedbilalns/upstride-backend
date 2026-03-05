import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { GetPreSignedUploadUrlUseCase } from "../../../application/storage-management/use-cases/get-presigned-upload-url.usecase";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler } from "../helpers";
import { getPreSignedUploadUrlSchema } from "../validators/file.validator";

@injectable()
export class FileController {
	constructor(
		@inject(TYPES.UseCases.GetPreSignedUploadUrl)
		private readonly getPreSignedUploadUrlUseCase: GetPreSignedUploadUrlUseCase,
	) {}

	getPreSignedUploadUrl = asyncHandler(async (req: Request, res: Response) => {
		const payload = getPreSignedUploadUrlSchema.parse(req.body);

		const result = await this.getPreSignedUploadUrlUseCase.execute(payload);

		return res.status(200).json({
			success: true,
			data: result,
		});
	});
}
