import {
    GetPricingConfigDto,
    PricingConfigResponseDto,
} from "../../../application/dtos/pricing-config.dto";

export interface IGetPricingConfigUC {
    execute(dto: GetPricingConfigDto): Promise<PricingConfigResponseDto | null>;
}
