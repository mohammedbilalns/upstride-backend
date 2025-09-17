import { Media } from "../entities/media.entity";
import {
  CreateSignatureResponse,
  getMediaData,
  getMediasDto,
  SaveMediaDto,
} from "../../application/dtos/media.dto";

export interface IMediaMangementService {
  saveMedia(saveMediaDto: SaveMediaDto): Promise<void>;
  createSignature(): Promise<CreateSignatureResponse>;
  getMedia(data: getMediaData): Promise<Media>;
  getMedias(data: getMediasDto): Promise<Partial<Media>[]>;
  deleteMedia(publicId: string, resource_type: string): Promise<void>;
}
