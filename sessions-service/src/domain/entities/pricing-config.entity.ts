import type { AllowedDuration } from "../../application/dtos/pricing-config.dto";

export interface PricingTier {
    duration: AllowedDuration; // Only 30, 60, or 90 minutes
    price: number;
}

export interface PricingConfig {
    id: string;
    mentorId: string;
    pricingTiers: PricingTier[];
    isActive: boolean;
}
