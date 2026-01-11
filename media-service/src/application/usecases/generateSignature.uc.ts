import type { IMediaStorageService } from "../../domain/services/mediaStorage.service.interface";
import type { IGenerateSignatureUC } from "../../domain/useCases/generateSignature.uc.interface";
import type { CreateSignatureResponse } from "../dtos/media.dto";

export class GenerateSignatureUC implements IGenerateSignatureUC {
	constructor(private _mediaStorageService: IMediaStorageService) {}

	execute(): CreateSignatureResponse {
		return this._mediaStorageService.createSignature();
	}
}
