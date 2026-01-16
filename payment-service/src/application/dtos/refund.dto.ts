export interface ProcessRefundDto {
    bookingId: string;
    userId: string;
    mentorId: string;
    totalAmount: number;
    refundBreakdown: {
        userAmount: number;
        mentorAmount: number;
        platformAmount: number;
        userPercentage: number;
        mentorPercentage: number;
        platformPercentage: number;
    };
}
