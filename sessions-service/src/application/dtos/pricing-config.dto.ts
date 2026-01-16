export const ALLOWED_DURATIONS = [30, 60, 90] as const;
export type AllowedDuration = typeof ALLOWED_DURATIONS[number];

export interface PricingTierDto {
    duration: AllowedDuration; 
    price: number; 
}

export interface SetPricingConfigDto {
    mentorId: string;
    pricingTiers: PricingTierDto[];
    updateExistingSlots?: boolean;
}

export interface GetPricingConfigDto {
    mentorId: string;
}

export interface PricingConfigResponseDto {
    id: string;
    mentorId: string;
    pricingTiers: PricingTierDto[];
    mentorEarnings: { duration: number; earnings: number }[];
    isActive: boolean;
}
