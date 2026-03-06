import { randomUUID } from "node:crypto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../shared/types/types";
import type { IStorageService } from "../../services/storage.service.interface";
import type {
	GetPreSignedUploadUrlInput,
	GetPreSignedUploadUrlOutput,
} from "../dtos/get-presigned-upload-url.dto";

@injectable()
export class GetPreSignedUploadUrlUseCase {
	constructor(
		@inject(TYPES.Services.Storage)
		private readonly storageService: IStorageService,
	) {}

	async execute({
		fileName,
		mimetype,
		category,
	}: GetPreSignedUploadUrlInput): Promise<GetPreSignedUploadUrlOutput> {
		const fileExtension = fileName.split(".").pop();
		const key = `${category}/${randomUUID()}.${fileExtension}`;

		const { url, fields } = await this.storageService.getPresignedPost(
			key,
			mimetype,
		);

		return { url, fields, key };
	}
}
