import { Media } from "../entities/media.entity";
import {
  CreateSignatureResponse,
  getMediaData,
  getMediasDto,
  SaveMediaDto,
} from "../../application/dtos/media.dto";
import { Readable } from "node:stream";

export interface IMediaMangementService {
  saveMedia(saveMediaDto: SaveMediaDto): Promise<void>;
  createSignature(): Promise<CreateSignatureResponse>;
	streamMedia(publicId: string, mediaType: string): Promise<{stream: Readable, contentType: string;}>;
  getMedia(data: getMediaData): Promise<Media>;
  getMedias(data: getMediasDto): Promise<Partial<Media>[]>;
  deleteMedia(publicId: string, resource_type: string): Promise<void>;
}
