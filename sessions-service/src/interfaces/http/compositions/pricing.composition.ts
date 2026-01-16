import { SetPricingConfigUC } from "../../../application/usecases/pricing/set-pricing-config.uc";
import { GetPricingConfigUC } from "../../../application/usecases/pricing/get-pricing-config.uc";
import { PricingConfigRepository } from "../../../infrastructure/database/repositories/pricing-config.repository";
import { SlotRepository } from "../../../infrastructure/database/repositories/slot.repository";
import { PricingController } from "../controllers/pricing.controller";

export function createPricingController(): PricingController {
    // ─────────────────────────────────────────────
    // Repositories
    // ─────────────────────────────────────────────
    const pricingConfigRepository = new PricingConfigRepository();
    const slotRepository = new SlotRepository();

    // ─────────────────────────────────────────────
    // Use Cases
    // ─────────────────────────────────────────────
    const setPricingConfigUC = new SetPricingConfigUC(pricingConfigRepository, slotRepository);
    const getPricingConfigUC = new GetPricingConfigUC(pricingConfigRepository);

    // ─────────────────────────────────────────────
    // Controller
    // ─────────────────────────────────────────────
    return new PricingController(setPricingConfigUC, getPricingConfigUC);
}
