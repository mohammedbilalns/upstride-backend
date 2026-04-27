import type { Container } from "inversify";
import {
	CreateReviewUseCase,
	GetMentorReviewsUseCase,
	type ICreateReviewUseCase,
	type IGetMentorReviewsUseCase,
} from "../../application/modules/review/use-cases";
import { ReviewController } from "../../presentation/http/controllers/review.controller";
import { TYPES } from "../../shared/types/types";

export const registerReviewBindings = (container: Container): void => {
	container
		.bind<ICreateReviewUseCase>(TYPES.UseCases.CreateReview)
		.to(CreateReviewUseCase)
		.inSingletonScope();
	container
		.bind<IGetMentorReviewsUseCase>(TYPES.UseCases.GetMentorReviews)
		.to(GetMentorReviewsUseCase)
		.inSingletonScope();
	container
		.bind<ReviewController>(TYPES.Controllers.Review)
		.to(ReviewController)
		.inSingletonScope();
};
