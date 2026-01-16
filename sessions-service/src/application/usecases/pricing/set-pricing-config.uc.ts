import { ISetPricingConfigUC } from "../../../domain/useCases/pricing/set-pricing-config.uc.interface";
import { IPricingConfigRepository } from "../../../domain/repositories/pricing-config.repository.interface";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import {
  SetPricingConfigDto,
  PricingConfigResponseDto,
} from "../../dtos/pricing-config.dto";
import { AppError } from "../../errors/app-error";
import { ErrorMessage } from "../../../common/enums/error-messages";
import { HttpStatus } from "../../../common/enums";
import logger from "../../../common/utils/logger";

const MENTOR_COMMISSION_RATE = 0.9; // 90%

export class SetPricingConfigUC implements ISetPricingConfigUC {
  constructor(
    private _pricingConfigRepository: IPricingConfigRepository,
    private _slotRepository: ISlotRepository,
  ) { }

  /**
     * Sets or updates the pricing configuration for a mentor.
     */
  async execute(dto: SetPricingConfigDto): Promise<PricingConfigResponseDto> {
    // Check if pricing config already exists
    const existing = await this._pricingConfigRepository.findByMentor(
      dto.mentorId,
    );

    let config;
    if (existing) {
      logger.info(`Pricing config found for mentor ${dto.mentorId} updating it.`);
      // Update existing config
      config = await this._pricingConfigRepository.update(dto.mentorId, {
        pricingTiers: dto.pricingTiers,
        isActive: true,
      });
    } else {
      logger.info(`No pricing config found for mentor ${dto.mentorId}. Creating It.`);
      // Create new config
      throw new AppError(
        ErrorMessage.PRICING_CONFIG_NOT_FOUND,
        HttpStatus.NOT_FOUND
      )
    }

    if (!config) {
      throw new AppError(
        ErrorMessage.PRICING_CONFIG_SAVE_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // If requested, update future open slots with new prices
    if (dto.updateExistingSlots) {
      await Promise.all(
        dto.pricingTiers.map((tier) =>
          this._slotRepository.updatePriceForFutureSlots(
            dto.mentorId,
            tier.duration,
            tier.price,
          ),
        ),
      );
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
