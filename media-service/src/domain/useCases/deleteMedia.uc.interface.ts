import type { DeleteMediaDto } from "../../application/dtos/media.dto";

export interface IDeleteMediaUC {
	execute(dto: DeleteMediaDto): Promise<void>;
}
