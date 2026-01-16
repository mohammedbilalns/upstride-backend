import { WalletRepository } from "../../../infrastructure/database/repositories/wallet.repository";
import { LedgerRepository } from "../../../infrastructure/database/repositories/ledger.repository";
import { GetPlatformAnalyticsUC } from "../../../application/useCases/analytics/get-platform-analytics.uc";
import { AnalyticsController } from "../controllers/analytics.controller";

export function createAnalyticsController(): AnalyticsController {
    const walletRepository = new WalletRepository();
    const ledgerRepository = new LedgerRepository();

    const getPlatformAnalyticsUC = new GetPlatformAnalyticsUC(
        walletRepository,
        ledgerRepository,
    );

    return new AnalyticsController(getPlatformAnalyticsUC);
}
