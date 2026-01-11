import type {
	StreamMediaDto,
	StreamMediaResult,
} from "../../application/dtos/media.dto";

export interface IStreamMediaUC {
	execute(dto: StreamMediaDto): Promise<StreamMediaResult>;
}
