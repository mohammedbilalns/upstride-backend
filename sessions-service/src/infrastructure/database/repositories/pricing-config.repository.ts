import { IPricingConfigRepository } from "../../../domain/repositories/pricing-config.repository.interface";
import { PricingConfig } from "../../../domain/entities/pricing-config.entity";
import {
    PricingConfigModel,
    PricingConfigDocument,
} from "../models/pricing-config.model";
import { BaseRepository } from "./base.repository";

export class PricingConfigRepository
    extends BaseRepository<PricingConfig, PricingConfigDocument>
    implements IPricingConfigRepository {
    constructor() {
        super(PricingConfigModel);
    }

    protected mapToDomain(doc: PricingConfigDocument): PricingConfig {
        return {
            id: doc._id!.toString(),
            mentorId: doc.mentorId,
            pricingTiers: doc.pricingTiers,
            isActive: doc.isActive,
        };
    }

    async findByMentor(mentorId: string): Promise<PricingConfig | null> {
        const config = await PricingConfigModel.findOne({ mentorId });
        return config ? this.mapToDomain(config) : null;
    }

    async update(
        mentorId: string,
        data: Partial<PricingConfig>,
    ): Promise<PricingConfig | null> {
        const config = await PricingConfigModel.findOneAndUpdate(
            { mentorId },
            data,
            { new: true },
        );
        return config ? this.mapToDomain(config) : null;
    }
}
