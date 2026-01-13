import { HttpStatus, ResponseMessage } from "../../../common/enums";
import { ErrorMessage } from "../../../common/enums";
import { AppError } from "../../../application/errors/app-error";
import type { IUploadMediaUC } from "../../../domain/useCases/upload-media.uc.interface";
import type { IStreamMediaUC } from "../../../domain/useCases/stream-media.uc.interface";
import type { IDeleteMediaUC } from "../../../domain/useCases/delete-media.uc.interface";
import type { IGenerateSignatureUC } from "../../../domain/useCases/generate-signature.uc.interface";
import type { IGetSignedViewUrlUC } from "../../../domain/useCases/get-signed-view-url.uc.interface";
import asyncHandler from "../utils/async-handler";
import {
	deleteMediaParamsSchema,
	getSignedUrlBodySchema,
	uploadMediaBodySchema,
} from "../validations/media.schema";

export class MediaController {
	constructor(
		private _uploadMediaUC: IUploadMediaUC,
		private _streamMediaUC: IStreamMediaUC,
		private _deleteMediaUC: IDeleteMediaUC,
		private _generateSignatureUC: IGenerateSignatureUC,
		private _getSignedViewUrlUC: IGetSignedViewUrlUC,
	) {}

	public uploadMedia = asyncHandler(async (req, res) => {
		if (!req.file) {
			throw new AppError(ErrorMessage.NO_FILE_FOUND, HttpStatus.BAD_REQUEST);
		}
		const { resource_type } = uploadMediaBodySchema.parse(req.body);

		const result = await this._uploadMediaUC.execute({
			file: req.file,
			resourceType: resource_type,
		});

		res.status(HttpStatus.OK).json({
			message: ResponseMessage.MEDIA_UPLOADED_SUCCESSFULLY,
			data: result,
		});
	});

	public generateSignature = asyncHandler(async (_req, res) => {
		const signatureData = this._generateSignatureUC.execute();
		res.status(HttpStatus.OK).json({ data: signatureData });
	});

	public streamMedia = asyncHandler(async (req, res) => {
		const { publicId, mediaType } = getSignedUrlBodySchema.parse(req.body);
		const { stream, contentType } = await this._streamMediaUC.execute({
			publicId,
			mediaType,
		});
		res.setHeader("Content-Type", contentType);
		// For raw files without extension in publicId, add .pdf to filename for proper display
		let filename = publicId;
		if (mediaType === "raw" && !publicId.includes(".")) {
			filename = `${publicId}.pdf`;
		}
		res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
		stream.pipe(res);
	});

	public getSignedViewUrl = asyncHandler(async (req, res) => {
		const { publicId, mediaType } = getSignedUrlBodySchema.parse(req.body);
		const url = this._getSignedViewUrlUC.execute({ publicId, mediaType });
		res.status(HttpStatus.OK).json({ url });
	});

	public deleteMedia = asyncHandler(async (req, res) => {
		const { publicId, mediaType } = deleteMediaParamsSchema.parse(req.params);
		await this._deleteMediaUC.execute({
			publicId,
			resourceType: mediaType,
		});
		res
			.status(HttpStatus.OK)
			.json({ message: ResponseMessage.MEDIA_DELETED_SUCCESSFULLY });
	});
}
