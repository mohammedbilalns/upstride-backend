import { Router } from "express";
import { apiContainer } from "../../../main/di/api.container";
import { ROUTES } from "../constants";
import { WalletController } from "../controllers/wallet.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	CoinTransactionsQuerySchema,
	PaymentTransactionsQuerySchema,
} from "../validators";

const router = Router();
const controller = apiContainer.get(WalletController);

router.use(verifySession);

router.get(ROUTES.WALLET.COIN_BALANCE, controller.getCoinBalance);

router.get(
	ROUTES.WALLET.COIN_TRANSACTIONS,
	validate({ query: CoinTransactionsQuerySchema }),
	controller.getCoinTransactions,
);

router.get(
	ROUTES.WALLET.PAYMENT_TRANSACTIONS,
	validate({ query: PaymentTransactionsQuerySchema }),
	controller.getPaymentTransactions,
);

router.get(
	ROUTES.WALLET.PLATFORM_BALANCE,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	controller.getPlatformWallet,
);

router.get(
	ROUTES.WALLET.PLATFORM_COIN_TRANSACTIONS,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ query: CoinTransactionsQuerySchema }),
	controller.getPlatformCoinTransactions,
);

router.get(
	ROUTES.WALLET.PLATFORM_PAYMENT_TRANSACTIONS,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ query: PaymentTransactionsQuerySchema }),
	controller.getPlatformPaymentTransactions,
);

export { router as walletRouter };
