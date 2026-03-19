import "reflect-metadata";
import { CoinTransactionType } from "../src/domain/entities/coin-transactions.entity";
import { CoinTransactionModel } from "../src/infrastructure/database/mongodb/models/coin-transactions.model";
import { PaymentTransactionModel } from "../src/infrastructure/database/mongodb/models/payment-transactions.model";
import { PlatformWalletModel } from "../src/infrastructure/database/mongodb/models/platform-wallet.model";
import { SessionBookingModel } from "../src/infrastructure/database/mongodb/models/session-booking.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import logger from "../src/shared/logging/logger";

const PLATFORM_OWNER = "platform";
const PLATFORM_WALLET_KEY = "platform";

const generatePlatformTransactions = async () => {
	try {
		await connectToMongo();

		const wallet = await PlatformWalletModel.findOneAndUpdate(
			{ key: PLATFORM_WALLET_KEY },
			{ $setOnInsert: { key: PLATFORM_WALLET_KEY, balance: 0 } },
			{ upsert: true, new: true },
		).lean();

		let platformBalance = wallet?.balance ?? 0;

		const bookings = await SessionBookingModel.find().lean();
		let createdCount = 0;

		for (const booking of bookings) {
			const referenceId = booking._id.toString();
			const exists = await CoinTransactionModel.findOne({
				referenceType: "session_booking",
				referenceId,
				transactionOwner: PLATFORM_OWNER,
			}).lean();

			if (exists) continue;

			await CoinTransactionModel.create({
				userId: booking.userId,
				amount: booking.price,
				type: CoinTransactionType.SessionEarning,
				referenceType: "session_booking",
				referenceId,
				transactionOwner: PLATFORM_OWNER,
			});
			platformBalance += booking.price;
			createdCount += 1;
		}

		if (wallet && platformBalance !== wallet.balance) {
			await PlatformWalletModel.updateOne(
				{ _id: wallet._id },
				{ $set: { balance: platformBalance } },
			);
		}

		const paymentUpdate = await PaymentTransactionModel.updateMany(
			{ transactionOwner: { $exists: false } },
			{ $set: { transactionOwner: PLATFORM_OWNER } },
		);

		logger.info(
			`Platform transactions created: ${createdCount}. Payment transactions updated: ${paymentUpdate.modifiedCount}. Platform balance: ${platformBalance}`,
		);
	} catch (error) {
		logger.error(`Error generating platform transactions: ${error}`);
		process.exitCode = 1;
	} finally {
		await disconnectFromMongo();
	}
};

generatePlatformTransactions();
