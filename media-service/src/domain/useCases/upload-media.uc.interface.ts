import type {
	UploadMediaResponse,
	UploadMediaDto,
} from "../../application/dtos/media.dto";

export interface IUploadMediaUC {
	execute(dto: UploadMediaDto): Promise<UploadMediaResponse>;
}
