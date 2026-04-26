import { Types } from "mongoose";
import { ArticleModel } from "../src/infrastructure/database/mongodb/models/article.model";
import { UserModel } from "../src/infrastructure/database/mongodb/models/user.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import logger from "../src/shared/logging/logger";

const backfillArticleAuthorInterestIds = async () => {
	try {
		await connectToMongo();

		const articles = await ArticleModel.find(
			{},
			{ _id: 1, authorId: 1, authorSnapshot: 1 },
		).lean();

		const authorIds = Array.from(
			new Set(articles.map((article) => article.authorId.toString())),
		);

		const authors = await UserModel.find(
			{ _id: { $in: authorIds.map((id) => new Types.ObjectId(id)) } },
			{ _id: 1, "preferences.interests": 1 },
		).lean();

		const authorInterestMap = new Map(
			authors.map((author) => [
				author._id.toString(),
				(author.preferences?.interests ?? []).map((interestId) =>
					interestId.toString(),
				),
			]),
		);

		const operations = articles
			.map((article) => {
				const interestIds =
					authorInterestMap.get(article.authorId.toString()) ?? [];
				const existingInterestIds = (
					article.authorSnapshot?.interestIds ?? []
				).map((interestId) => interestId.toString());

				const unchanged =
					existingInterestIds.length === interestIds.length &&
					existingInterestIds.every(
						(existingId, index) => existingId === interestIds[index],
					);

				if (unchanged) {
					return null;
				}

				return {
					updateOne: {
						filter: { _id: article._id },
						update: {
							$set: {
								"authorSnapshot.interestIds": interestIds.map(
									(interestId) => new Types.ObjectId(interestId),
								),
							},
						},
					},
				};
			})
			.filter((operation) => operation !== null);

		if (operations.length === 0) {
			logger.info("No article authorSnapshot.interestIds updates were needed.");
			return;
		}

		const result = await ArticleModel.bulkWrite(operations);

		logger.info(
			`Backfilled authorSnapshot.interestIds for ${result.modifiedCount ?? 0} articles.`,
		);
	} catch (error) {
		logger.error(`Error backfilling article author interest ids: ${error}`);
		process.exitCode = 1;
	} finally {
		await disconnectFromMongo();
	}
};

backfillArticleAuthorInterestIds();
