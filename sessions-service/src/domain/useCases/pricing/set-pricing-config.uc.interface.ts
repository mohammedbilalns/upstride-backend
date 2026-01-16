import {
    SetPricingConfigDto,
    PricingConfigResponseDto,
} from "../../../application/dtos/pricing-config.dto";

export interface ISetPricingConfigUC {
    execute(dto: SetPricingConfigDto): Promise<PricingConfigResponseDto>;
}
