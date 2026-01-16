/**
 * Success messages.
 */
export const ResponseMessage = {
    INVALID_OWNER_TYPE: "Invalid ownerType. Must be USER, MENTOR, or PLATFORM",
    WALLET_BALANCE_RETRIEVED: "Wallet balance retrieved successfully",
    TRANSACTION_HISTORY_RETRIEVED: "Transaction history retrieved successfully",
    PAYMENT_INITIATED: "Payment initiated successfully",
    PAYMENT_CAPTURED: "Payment captured successfully",
    PAYMENT_SUCCESSFUL: "Payment successful"
} as const;

export type ResponseMessageKey = keyof typeof ResponseMessage;
export type ResponseMessageValue = (typeof ResponseMessage)[ResponseMessageKey];
