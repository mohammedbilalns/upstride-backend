import { inject, injectable } from "inversify";
import type { IGetOnboardingCatalogUseCase } from "../../../application/catalog-management/use-cases/get-onboarding-catalog.usecase.interface";
import { HttpStatus } from "../../../shared/constants";
import { TYPES } from "../../../shared/types/types";
import { CatalogResponseMessages } from "../constants/response-messages";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class CatalogController {
	constructor(
		@inject(TYPES.UseCases.GetOnboardingCatalog)
		private _getOnboardingCatalogUseCase: IGetOnboardingCatalogUseCase,
	) {}

	getOnboardingCatalog = asyncHandler(async (_req, res) => {
		const data = await this._getOnboardingCatalogUseCase.execute();

		sendSuccess(res, HttpStatus.OK, {
			message: CatalogResponseMessages.CATALOG_FETCHED_SUCCESS,
			data,
		});
	});
}
