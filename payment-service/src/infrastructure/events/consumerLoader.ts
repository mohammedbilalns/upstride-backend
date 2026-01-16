import eventBus from "./eventBus";
import { WalletRepository } from "../database/repositories/wallet.repository";
import { LedgerRepository } from "../database/repositories/ledger.repository";
import { ProcessRefundUC } from "../../application/useCases/refunds/process-refund.uc";
import { BookingCancelledSubscriber } from "../../interfaces/events/subscribers/booking-cancelled.subscriber";
import logger from "../../common/utils/logger";
import { ProcessPayoutUC } from "../../application/useCases/payouts/process-payout.uc";
import { SessionCompletedSubscriber } from "../../interfaces/events/subscribers/session-completed.subscriber";

import { CreateWalletUC } from "../../application/useCases/wallets/create-wallet.uc";

export async function loadConsumers() {
	try {
		const walletRepository = new WalletRepository();
		const ledgerRepository = new LedgerRepository();
		const createWalletUC = new CreateWalletUC(walletRepository);
		const processRefundUC = new ProcessRefundUC(walletRepository, ledgerRepository, createWalletUC);
		const processPayoutUC = new ProcessPayoutUC(walletRepository, ledgerRepository);

		const bookingCancelledSubscriber = new BookingCancelledSubscriber(eventBus, processRefundUC);
		await bookingCancelledSubscriber.subscribe();

		const sessionCompletedSubscriber = new SessionCompletedSubscriber(eventBus, processPayoutUC);
		await sessionCompletedSubscriber.subscribe();

		logger.info("Event consumers loaded");
	} catch (error) {
		logger.error("Error loading consumers", error);
	}
}
