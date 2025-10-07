import { HttpStatus, ResponseMessage } from "../../../common/enums";
import type { IMediaMangementService } from "../../../domain/services/mediaMangement.service.interface";
import asyncHandler from "../utils/asyncHandler";
import {
	deleteMediaParamsSchema,
	getSignedUrlBodySchema,
} from "../validations/media.schema";

export class MediaController {
	constructor(private _mediaService: IMediaMangementService) {}

	generateSignature = asyncHandler(async (_req, res) => {
		const signatureData = await this._mediaService.createSignature();
		res.status(HttpStatus.OK).json({ data: signatureData });
	});

	streamMedia = asyncHandler(async (req, res) => {
		const { publicId, mediaType } = getSignedUrlBodySchema.parse(req.body);
		const { stream, contentType } = await this._mediaService.streamMedia(
			publicId,
			mediaType,
		);
		res.setHeader("Content-Type", contentType);
		res.setHeader("Content-Disposition", `inline; filename="${publicId}"`);
		stream.pipe(res);
	});

	deleteMedia = asyncHandler(async (req, res) => {
		const { publicId, mediaType } = deleteMediaParamsSchema.parse(req.params);
		console.log("publicId in params");
		await this._mediaService.deleteMedia(publicId, mediaType);
		res
			.status(HttpStatus.OK)
			.json({ message: ResponseMessage.MEDIA_DELETED_SUCCESSFULLY });
	});
	// getMedia = asyncHandler(async (req, res) => {
	//   const { publicId, articleId, chatMessageId, mentorId } = req.body;
	//   const data = {
	//     publicId,
	//     articleId,
	//     chatMessageId,
	//     mentorId,
	//     userId: res.locals.user.id,
	//   };
	//   const media = await this._mediaService.getMedia(data);
	//   res.status(HttpStatus.OK).json({ data: media });
	// });

	// getMedias = asyncHandler(async (req, res) => {
	//   const { publicIds } = req.body;
	//   const data = {
	//     publicIds,
	//     userId: res.locals.user.id,
	//   };
	//   const medias = await this._mediaService.getMedias(data);
	//   res.status(HttpStatus.OK).json({ data: medias });
	// });
}
