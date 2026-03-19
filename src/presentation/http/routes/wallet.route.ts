import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { WalletController } from "../controllers/wallet.controller";
import { authorizeRoles, validate, verifySession } from "../middlewares";
import {
	CoinTransactionsQuerySchema,
	PaymentTransactionsQuerySchema,
} from "../validators";

const router = Router();
const controller = container.get<WalletController>(TYPES.Controllers.Wallet);

router.use(verifySession);

router.get(
	ROUTES.WALLET.COIN_BALANCE,
	controller.getCoinBalance.bind(controller),
);

router.get(
	ROUTES.WALLET.COIN_TRANSACTIONS,
	validate({ query: CoinTransactionsQuerySchema }),
	controller.getCoinTransactions.bind(controller),
);

router.get(
	ROUTES.WALLET.PAYMENT_TRANSACTIONS,
	validate({ query: PaymentTransactionsQuerySchema }),
	controller.getPaymentTransactions.bind(controller),
);

router.get(
	ROUTES.WALLET.PLATFORM_BALANCE,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	controller.getPlatformWallet.bind(controller),
);

router.get(
	ROUTES.WALLET.PLATFORM_COIN_TRANSACTIONS,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ query: CoinTransactionsQuerySchema }),
	controller.getPlatformCoinTransactions.bind(controller),
);

router.get(
	ROUTES.WALLET.PLATFORM_PAYMENT_TRANSACTIONS,
	authorizeRoles(["ADMIN", "SUPER_ADMIN"]),
	validate({ query: PaymentTransactionsQuerySchema }),
	controller.getPlatformPaymentTransactions.bind(controller),
);

export { router as walletRouter };
