import type { IMediaStorageService } from "../../domain/services/media-storage.service.interface";
import type { IGenerateSignatureUC } from "../../domain/useCases/generate-signature.uc.interface";
import type { CreateSignatureResponse } from "../dtos/media.dto";

export class GenerateSignatureUC implements IGenerateSignatureUC {
	constructor(private _mediaStorageService: IMediaStorageService) {}

	execute(): CreateSignatureResponse {
		return this._mediaStorageService.createSignature();
	}
}
