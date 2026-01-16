import { Request, Response } from "express";
import { ISetPricingConfigUC } from "../../../domain/useCases/pricing/set-pricing-config.uc.interface";
import { IGetPricingConfigUC } from "../../../domain/useCases/pricing/get-pricing-config.uc.interface";
import { HttpStatus } from "../../../common/enums";
import { ResponseMessage } from "../../../common/enums/response-messages";
import asyncHandler from "../utils/async-handler";
import { setPricingConfigSchema } from "../validations/pricing-config.validation";

export class PricingController {
    constructor(
        private _setPricingConfigUC: ISetPricingConfigUC,
        private _getPricingConfigUC: IGetPricingConfigUC,
    ) { }

    /**
     * Sets the pricing configuration for a mentor.
     */
    setPricingConfig = asyncHandler(async (req: Request, res: Response) => {

        const mentorId = res.locals.user.mentorId;
        const { pricingTiers, updateExistingSlots } = setPricingConfigSchema.parse(req).body ;

        const config = await this._setPricingConfigUC.execute({
            mentorId,
            pricingTiers: pricingTiers, 
            updateExistingSlots,
        });

        return res.status(HttpStatus.OK).json({
            message: ResponseMessage.PRICING_CONFIG_SAVED,
            data: config,
        });
    });

    /**
     * Retrieves the pricing configuration for a specific mentor.
     */
    getPricingConfig = asyncHandler(async (_req: Request, res: Response) => {
        //const { params } = getMentorPricingSchema.parse({ params: req.params });
        const mentorId =  res.locals.user.mentorId;

        const config = await this._getPricingConfigUC.execute({ mentorId });

        return res.status(HttpStatus.OK).json({
            data: config,
        });
    });
}
