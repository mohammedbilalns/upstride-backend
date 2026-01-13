import type { GetSignedViewUrlDto } from "../../application/dtos/media.dto";

export interface IGetSignedViewUrlUC {
	execute(dto: GetSignedViewUrlDto): string;
}
