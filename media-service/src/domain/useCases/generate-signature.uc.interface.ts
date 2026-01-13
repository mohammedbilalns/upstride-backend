import type { CreateSignatureResponse } from "../../application/dtos/media.dto";

export interface IGenerateSignatureUC {
	execute(): CreateSignatureResponse;
}
