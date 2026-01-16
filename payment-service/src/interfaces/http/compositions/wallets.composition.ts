import { GetWalletBalanceUC } from "../../../application/useCases/wallets/get-wallet-balance.uc";

import { GetWalletDetailsUC } from "../../../application/useCases/wallets/get-wallet-details.uc";
import { WalletRepository } from "../../../infrastructure/database/repositories/wallet.repository";
import { LedgerRepository } from "../../../infrastructure/database/repositories/ledger.repository";
import { WalletsController } from "../controllers/wallets.controller";

export function createWalletsController(): WalletsController {
    // ─────────────────────────────────────────────
    // Dependencies
    // ─────────────────────────────────────────────
    const walletRepository = new WalletRepository();
    const ledgerRepository = new LedgerRepository();

    // ─────────────────────────────────────────────
    // Use Cases
    // ─────────────────────────────────────────────
    const getWalletBalanceUC = new GetWalletBalanceUC(walletRepository);
    const getWalletDetailsUC = new GetWalletDetailsUC(walletRepository, ledgerRepository);

    // ─────────────────────────────────────────────
    // Controller
    // ─────────────────────────────────────────────
    return new WalletsController(
        getWalletBalanceUC,
        getWalletDetailsUC
    );
}
