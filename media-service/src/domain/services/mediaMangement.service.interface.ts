import { Media } from "../entities/media.entity";
import {
  CreateSignatureResponse,
  getMediaData,
  getMediasDto,
  uploadMediaDto,
} from "../../application/dtos/media.dto";

export interface IMediaMangementService {
  saveMedia(data: uploadMediaDto): Promise<void>;
  createSignature(
    timeStamp: number,
    userId: string,
  ): Promise<CreateSignatureResponse>;
  getMedia(data: getMediaData): Promise<Media>;
  getMedias(data: getMediasDto): Promise<Partial<Media>[]>;
  deleteMedia(publicId: string, userId: string): Promise<void>;
}
