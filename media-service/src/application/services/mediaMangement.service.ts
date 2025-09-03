import { IMediaMangementService } from "../../domain/services/mediaMangement.service.interface";
import { AppError } from "../errors/AppError";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import { v2 as cloudinary } from "cloudinary";
import env from "../../infrastructure/config/env";
import {
  CreateSignatureResponse,
  getMediaData,
  getMediasDto,
  uploadMediaDto,
} from "../dtos/media.dto";
import { IMediaRepository } from "../../domain/repositories/media.repository.interface";
import { Media } from "../../domain/entities/media.entity";

export class MediaManagementService implements IMediaMangementService {
  constructor(private _mediaRepository: IMediaRepository) {}

  async createSignature(
    timeStamp: number,
    userId: string,
  ): Promise<CreateSignatureResponse> {
    if (Math.abs(timeStamp - Date.now()) > 1000 * 60 * 60 * 24 * 30) {
      throw new AppError(
        ErrorMessage.INVALID_TIMESTAMP,
        HttpStatus.BAD_REQUEST,
      );
    }

    const paramsToSign = {
      timeStamp,
      folder: `uploads/users/${userId}`,
      resource_type: "auto",
      allowed_formats: "pdf,doc,docx,jpg,png,mp3,wav",
      eager: "",
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET,
    );
    return {
      signature,
      timeStamp,
      CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET,
      CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME,
    };
  }

  async saveMedia(data: uploadMediaDto): Promise<void> {
    await this._mediaRepository.create(data);
  }
  async getMedia(data: getMediaData): Promise<Media> {
    const media: Media = await this._mediaRepository.findOne(data);
    if (!media) {
      throw new AppError(ErrorMessage.MEDIA_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return media;
  }

  async getMedias(data: getMediasDto): Promise<Partial<Media>[]> {
    const medias = await this._mediaRepository.findAll(data);
    if (!medias) {
      throw new AppError(ErrorMessage.MEDIA_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return medias;
  }

  async deleteMedia(publicId: string, userId: string): Promise<void> {
    await Promise.all([
      cloudinary.uploader.destroy(publicId),
      this._mediaRepository.delete({ publicId, userId }),
    ]);
  }
}
