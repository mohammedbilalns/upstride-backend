import "reflect-metadata";
import { CoinTransactionModel } from "../src/infrastructure/database/mongodb/models/coin-transactions.model";
import { PaymentTransactionModel } from "../src/infrastructure/database/mongodb/models/payment-transactions.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import logger from "../src/shared/logging/logger";

const IST_OFFSET_MINUTES = 330;

const getUtcFromIst = (
	year: number,
	month: number,
	day: number,
	hour = 0,
	minute = 0,
	second = 0,
	millisecond = 0,
): Date =>
	new Date(
		Date.UTC(year, month - 1, day, hour, minute, second, millisecond) -
			IST_OFFSET_MINUTES * 60 * 1000,
	);

const getIstParts = (date: Date) => {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(date);

	return {
		year: Number(parts.find((part) => part.type === "year")?.value ?? "0"),
		month: Number(parts.find((part) => part.type === "month")?.value ?? "0"),
		day: Number(parts.find((part) => part.type === "day")?.value ?? "0"),
	};
};

const getRetentionCutoff = (now: Date = new Date()) => {
	const { year, month, day } = getIstParts(now);
	return getUtcFromIst(year, month, day - 2);
};

const pruneOldTransactions = async () => {
	const shouldApply = process.argv.includes("--apply");
	const cutoff = getRetentionCutoff();

	try {
		await connectToMongo();

		const [paymentCount, coinCount] = await Promise.all([
			PaymentTransactionModel.countDocuments({
				createdAt: { $lt: cutoff },
			}),
			CoinTransactionModel.countDocuments({
				createdAt: { $lt: cutoff },
			}),
		]);

		logger.info(
			[
				`Transaction cleanup cutoff: ${cutoff.toISOString()}`,
				"Retention window: keep records from the day before yesterday onward (IST).",
				`Payment transactions matched: ${paymentCount}`,
				`Coin transactions matched: ${coinCount}`,
				shouldApply
					? "Apply mode enabled. Deleting matched records."
					: "Dry run only. Re-run with --apply to delete matched records.",
			].join(" "),
		);

		if (!shouldApply) {
			return;
		}

		const [paymentResult, coinResult] = await Promise.all([
			PaymentTransactionModel.deleteMany({
				createdAt: { $lt: cutoff },
			}),
			CoinTransactionModel.deleteMany({
				createdAt: { $lt: cutoff },
			}),
		]);

		logger.info(
			`Deleted ${paymentResult.deletedCount ?? 0} payment transactions and ${coinResult.deletedCount ?? 0} coin transactions older than ${cutoff.toISOString()}.`,
		);
	} catch (error) {
		logger.error(`Error pruning old transactions: ${error}`);
		process.exitCode = 1;
	} finally {
		await disconnectFromMongo();
	}
};

pruneOldTransactions();
