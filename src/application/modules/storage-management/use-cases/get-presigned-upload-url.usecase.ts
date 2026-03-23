import { inject, injectable } from "inversify";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type { IStorageService } from "../../../services/storage.service.interface";
import type {
	GetPreSignedUploadUrlInput,
	GetPreSignedUploadUrlOutput,
} from "../dtos/get-presigned-upload-url.dto";

@injectable()
export class GetPreSignedUploadUrlUseCase {
	constructor(
		@inject(TYPES.Services.Storage)
		private readonly _storageService: IStorageService,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async execute({
		fileName,
		mimetype,
		category,
	}: GetPreSignedUploadUrlInput): Promise<GetPreSignedUploadUrlOutput> {
		const fileExtension = fileName.split(".").pop();
		const key = `${category}/${this._idGenerator.generate()}.${fileExtension}`;

		const { url, fields } = await this._storageService.getPresignedPost(
			key,
			mimetype,
		);

		return { url, fields, key };
	}
}
