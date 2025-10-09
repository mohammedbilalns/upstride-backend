import type {
	getMediaDto,
	getMediasDto,
	IMediaDto,
} from "../../application/dtos/media.dto";
import type { Media } from "../entities/media.entity";

export interface IMediaRepository {
	create(media: IMediaDto): Promise<Media>;
	findOne(data: getMediaDto): Promise<Media>;
	findAll(data: getMediasDto): Promise<Media[]>;
	delete(data: getMediaDto): Promise<void>;
}
