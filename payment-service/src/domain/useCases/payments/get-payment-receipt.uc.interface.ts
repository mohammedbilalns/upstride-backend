export interface IGetPaymentReceiptUC {
    execute(userId: string, paymentId: string): Promise<Buffer>;
}
