import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { ISlotRepository } from "../../../domain/repositories/slot.repository.interface";
import { ICreateCustomSlotUC } from "../../../domain/useCases/slots/create-custom-slot.uc.interface";
import { CreateCustomSlotDto } from "../../dtos/slot.dto";
import { AppError } from "../../errors/app-error";
import { SlotStatus } from "../../../domain/entities/slot.entity";

import { IPricingConfigRepository } from "../../../domain/repositories/pricing-config.repository.interface";

export class CreateCustomSlotUC implements ICreateCustomSlotUC {
	constructor(
		private _slotRepository: ISlotRepository,
		private _pricingConfigRepository: IPricingConfigRepository
	) { }

	/**
	 * Creates a custom availability slot.
	 */

	async execute(slotDetails: CreateCustomSlotDto): Promise<void> {
		const MAX_SLOTS = 20;
		const currentSlotCount = await this._slotRepository.countFutureSlotsByMentor(
			slotDetails.mentorId,
		);

		if (currentSlotCount >= MAX_SLOTS) {
			throw new AppError(
				`You cannot have more than ${MAX_SLOTS} active slots. Please remove some slots before adding new ones.`,
				HttpStatus.BAD_REQUEST,
			);
		}

		let pricingConfig = await this._pricingConfigRepository.findByMentor(
			slotDetails.mentorId,
		);

		if (!pricingConfig || !pricingConfig.isActive) {

			pricingConfig = await this._pricingConfigRepository.create({
				mentorId: slotDetails.mentorId,
				pricingTiers: [
					{ duration: 30, price: 500 },
					{ duration: 60, price: 1000 },
					{ duration: 90, price: 1500 },
				],
				isActive: true,
			});
		}

		// Find price for the specific duration
		const tier = pricingConfig.pricingTiers.find(
			(t) => t.duration === slotDetails.slotDuration,
		);

		if (!tier) {
			throw new AppError(
				`No pricing configured for ${slotDetails.slotDuration} minute slots`,
				HttpStatus.BAD_REQUEST,
			);
		}
		const finalPrice = tier.price;

		// check if there is already a slot overlapping the duration
		const overlappingSlot = await this._slotRepository.findOverlappingSlots(
			slotDetails.mentorId,
			slotDetails.startAt,
			slotDetails.endAt,
		);
		if (overlappingSlot)
			throw new AppError(
				ErrorMessage.SLOT_DURATION_OVERLAP,
				HttpStatus.BAD_REQUEST,
			);

		await this._slotRepository.create({
			mentorId: slotDetails.mentorId,
			startAt: slotDetails.startAt,
			endAt: slotDetails.endAt,
			price: finalPrice,
			generatedFrom: "custom",
			status: SlotStatus.OPEN,
		});
	}
}
