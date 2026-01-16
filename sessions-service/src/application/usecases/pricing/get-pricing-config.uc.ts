import { IGetPricingConfigUC } from "../../../domain/useCases/pricing/get-pricing-config.uc.interface";
import { IPricingConfigRepository } from "../../../domain/repositories/pricing-config.repository.interface";
import {
    GetPricingConfigDto,
    PricingConfigResponseDto,
} from "../../dtos/pricing-config.dto";
import logger from "../../../common/utils/logger";

const MENTOR_COMMISSION_RATE = 0.9; // 90%

export class GetPricingConfigUC implements IGetPricingConfigUC {
    constructor(private _pricingConfigRepository: IPricingConfigRepository) { }

    /**
     * Retrieves pricing configuration for a mentor.
     * Calculates mentor earnings based on commission rate.
     */
    async execute(
        dto: GetPricingConfigDto,
    ): Promise<PricingConfigResponseDto | null> {
        const config = await this._pricingConfigRepository.findByMentor(
            dto.mentorId,
        );


        if (!config) {
            logger.info(`No pricing config found for mentor ${dto.mentorId}. Creating default.`);

            // Create default config
            const newConfig = await this._pricingConfigRepository.create({
                mentorId: dto.mentorId,
                pricingTiers: [
                    { duration: 30, price: 500 },
                    { duration: 60, price: 1000 },
                    { duration: 90, price: 1500 },
                ],
                isActive: true,
            });

            const mentorEarnings = newConfig.pricingTiers.map((tier: any) => ({
                duration: tier.duration,
                earnings: tier.price * MENTOR_COMMISSION_RATE,
            }));

            return {
                id: newConfig.id!,
                mentorId: newConfig.mentorId,
                pricingTiers: newConfig.pricingTiers,
                mentorEarnings,
                isActive: newConfig.isActive,
            };
        }

        // Calculate mentor earnings (90% of each price)
        const mentorEarnings = config.pricingTiers.map((tier) => ({
            duration: tier.duration,
            earnings: tier.price * MENTOR_COMMISSION_RATE,
        }));

        return {
            id: config.id,
            mentorId: config.mentorId,
            pricingTiers: config.pricingTiers,
            mentorEarnings,
            isActive: config.isActive,
        };
    }
}
