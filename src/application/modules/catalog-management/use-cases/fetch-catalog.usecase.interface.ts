import type { FetchCatalogResponse } from "../dtos/fetch-catalog.dto";

export interface IFetchCatalogUseCase {
	execute(): Promise<FetchCatalogResponse>;
}
