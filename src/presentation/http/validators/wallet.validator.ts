import { z } from "zod";
import { CoinTransactionType } from "../../../domain/entities/coin-transactions.entity";
import { PaymentStatus } from "../../../domain/entities/payment-transactions.entity";
import { limitSchema, pageSchema } from "../../../shared/validators";

const PaginationSchema = {
	page: pageSchema,
	limit: limitSchema,
	sort: z.enum(["recent", "old"]).default("recent"),
};

export const CoinTransactionsQuerySchema = z.object({
	...PaginationSchema,
	type: z.enum(CoinTransactionType).optional(),
});
export type CoinTransactionsQuery = z.infer<typeof CoinTransactionsQuerySchema>;

export const PaymentTransactionsQuerySchema = z.object({
	...PaginationSchema,
	status: z.enum(PaymentStatus).optional(),
});
export type PaymentTransactionsQuery = z.infer<
	typeof PaymentTransactionsQuerySchema
>;
