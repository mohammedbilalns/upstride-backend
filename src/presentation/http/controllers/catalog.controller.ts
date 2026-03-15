import { inject, injectable } from "inversify";
import type {
	IFetchCatalogUseCase,
	IGetOnboardingCatalogUseCase,
	IGetProfessionsUseCase,
} from "../../../application/catalog-management/use-cases";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { CatalogResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class CatalogController {
	constructor(
		@inject(TYPES.UseCases.GetOnboardingCatalog)
		private _getOnboardingCatalogUseCase: IGetOnboardingCatalogUseCase,
		@inject(TYPES.UseCases.GetProfessions)
		private _getProfessionsUseCase: IGetProfessionsUseCase,
		@inject(TYPES.UseCases.FetchCatalog)
		private _fetchCatalogUseCase: IFetchCatalogUseCase,
	) {}

	fetchCatalog = asyncHandler(async (_req, res) => {
		const data = await this._fetchCatalogUseCase.execute();

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.CATALOG_FETCHED_SUCCESS,
			data,
		});
	});

	getOnboardingCatalog = asyncHandler(async (_req, res) => {
		const data = await this._getOnboardingCatalogUseCase.execute();

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.CATALOG_FETCHED_SUCCESS,
			data,
		});
	});

	getProfessions = asyncHandler(async (_req, res) => {
		const data = await this._getProfessionsUseCase.execute();

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.CATALOG_FETCHED_SUCCESS,
			data,
		});
	});
}
