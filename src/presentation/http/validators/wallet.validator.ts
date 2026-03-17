import { z } from "zod";
import { CoinTransactionType } from "../../../domain/entities/coin-transactions.entity";
import { PaymentStatus } from "../../../domain/entities/payment-transactions.entity";

const paginationSchema = {
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce
		.number()
		.int()
		.refine((val: number) => [10, 20, 50].includes(val), {
			message: "Limit must be 10, 20, or 50",
		})
		.default(10),
	sort: z.enum(["recent", "old"]).default("recent"),
};

export const CoinTransactionsQuerySchema = z.object({
	...paginationSchema,
	type: z.nativeEnum(CoinTransactionType).optional(),
});

export const PaymentTransactionsQuerySchema = z.object({
	...paginationSchema,
	status: z.nativeEnum(PaymentStatus).optional(),
});
