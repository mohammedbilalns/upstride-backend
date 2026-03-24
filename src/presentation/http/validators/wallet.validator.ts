import { z } from "zod";
import { CoinTransactionType } from "../../../domain/entities/coin-transactions.entity";
import { PaymentStatus } from "../../../domain/entities/payment-transactions.entity";
import { limitSchema, pageSchema } from "../../../shared/validators";

const paginationSchema = {
	page: pageSchema,
	limit: limitSchema,
	sort: z.enum(["recent", "old"]).default("recent"),
};

export const CoinTransactionsQuerySchema = z.object({
	...paginationSchema,
	type: z.enum(CoinTransactionType).optional(),
});

export const PaymentTransactionsQuerySchema = z.object({
	...paginationSchema,
	status: z.enum(PaymentStatus).optional(),
});
