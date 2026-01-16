import { PricingConfig } from "../entities/pricing-config.entity";

export interface IPricingConfigRepository {
    create(config: Omit<PricingConfig, "id" | "createdAt" | "updatedAt">): Promise<PricingConfig>;
    update(mentorId: string, config: Partial<Omit<PricingConfig, "id" | "mentorId" | "createdAt" | "updatedAt">>): Promise<PricingConfig | null>;
    findByMentor(mentorId: string): Promise<PricingConfig | null>;
    delete(mentorId: string): Promise<boolean>;
}
