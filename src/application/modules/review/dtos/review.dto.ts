export interface ReviewDto {
	id: string;
	mentorId: string;
	userId: string;
	bookingId: string;
	rating: number;
	comment: string;
	reviewerName: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateReviewInput {
	userId: string;
	bookingId: string;
	rating: number;
	comment: string;
}

export interface CreateReviewOutput {
	review: ReviewDto;
}

export interface GetMentorReviewsInput {
	mentorId: string;
	page?: number;
}

export interface GetMentorReviewsOutput {
	reviews: ReviewDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
