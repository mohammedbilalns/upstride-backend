import { IMediaMangementService } from "../../../domain/services/mediaMangement.service.interface";
import asyncHandler from "../utils/asyncHandler";
import { HttpStatus, ResponseMessage } from "../../../common/enums";

export class MediaController {
  constructor(private _mediaService: IMediaMangementService) {}

  generateSingnateure = asyncHandler(async (req, res) => {
    const { timeStamp } = req.body;
    const userId = res.locals.user.id;
    const signatureData = await this._mediaService.createSignature(
      timeStamp,
      userId,
    );
    res.status(HttpStatus.OK).json({ data: signatureData });
  });

  saveMedia = asyncHandler(async (req, res) => {
    const {
      mediaType,
      category,
      publicId,
      originalName,
      url,
      size,
      articleId,
      chatMessageId,
      mentorId,
    } = req.body;
    const data = {
      mediaType,
      category,
      publicId,
      originalName,
      url,
      size,
      articleId,
      chatMessageId,
      mentorId,
      userId: res.locals.user.id,
    };
    await this._mediaService.saveMedia(data);
    res
      .status(HttpStatus.OK)
      .json({ message: ResponseMessage.MEDIA_UPLOADED_SUCCESSFULLY });
  });

  getMedia = asyncHandler(async (req, res) => {
    const { publicId, articleId, chatMessageId, mentorId } = req.body;
    const data = {
      publicId,
      articleId,
      chatMessageId,
      mentorId,
      userId: res.locals.user.id,
    };
    const media = await this._mediaService.getMedia(data);
    res.status(HttpStatus.OK).json({ data: media });
  });

  getMedias = asyncHandler(async (req, res) => {
    const { publicIds } = req.body;
    const data = {
      publicIds,
      userId: res.locals.user.id,
    };
    const medias = await this._mediaService.getMedias(data);
    res.status(HttpStatus.OK).json({ data: medias });
  });

  deleteMedia = asyncHandler(async (req, res) => {
    const { publicId } = req.body;
    const userId = res.locals.user.id;
    await this._mediaService.deleteMedia(publicId, userId);
    res
      .status(HttpStatus.OK)
      .json({ message: ResponseMessage.MEDIA_DELETED_SUCCESSFULLY });
  });
}
