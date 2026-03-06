import { inject, injectable } from "inversify";
import { TYPES } from "../../../shared/types/types";
import type { IStorageService } from "../../services/storage.service.interface";

@injectable()
export class DeleteFileUseCase {
	constructor(
		@inject(TYPES.Services.Storage)
		private readonly storageService: IStorageService,
	) {}

	async execute(key: string): Promise<void> {
		await this.storageService.delete(key);
	}
}
