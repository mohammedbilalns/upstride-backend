import { IMediaMangementService } from "../../domain/services/mediaMangement.service.interface";
import { AppError } from "../errors/AppError";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import cloudinary from "../../infrastructure/config/cloudinary";
import env from "../../infrastructure/config/env";
import {
  CreateSignatureResponse,
  getMediaData,
  getMediasDto,
  SaveMediaDto,
} from "../dtos/media.dto";
import { IMediaRepository } from "../../domain/repositories/media.repository.interface";
import { Media } from "../../domain/entities/media.entity";

export class MediaManagementService implements IMediaMangementService {
  constructor(private _mediaRepository: IMediaRepository) {}

  async createSignature(): Promise<CreateSignatureResponse> {
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET,
    );

    return {
      signature,
      timestamp,
      api_key: env.CLOUDINARY_API_KEY,
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
    };
  }
  async saveMedia(saveMediaDto: SaveMediaDto): Promise<void> {
    const {
      resource_type,
      category,
      public_id,
      original_filename,
      secure_url,
      bytes,
      articleId,
      chatMessageId,
      mentorId,
      userId,
    } = saveMediaDto;
    await this._mediaRepository.create({
      mediaType: resource_type,
      category,
      publicId: public_id,
      originalName: original_filename,
      url: secure_url,
      size: bytes,
      articleId,
      chatMessageId,
      mentorId,
      userId,
    });
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

  async deleteMedia(publicId: string, resource_type: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type });
  }
}
