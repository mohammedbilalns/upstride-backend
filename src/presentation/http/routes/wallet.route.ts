import { Router } from "express";
import { container } from "../../../main/container";
import { TYPES } from "../../../shared/types/types";
import { ROUTES } from "../constants";
import type { WalletController } from "../controllers/wallet.controller";
import { validate, verifySession } from "../middlewares";
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

export { router as walletRouter };
