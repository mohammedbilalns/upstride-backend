export interface PlatformAnalyticsDto {
    platformBalance: number;
    totalRevenue: number;
    totalTransactions: number;
    transactions: Array<{
        id: string;
        amount: number;
        description: string;
        transactionType: string;
        createdAt: Date;
    }>;
}

export interface IGetPlatformAnalyticsUC {
    execute(limit?: number, offset?: number): Promise<PlatformAnalyticsDto>;
}
