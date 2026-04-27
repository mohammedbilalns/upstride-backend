import type { Types } from "mongoose";
import { BookingModel } from "../src/infrastructure/database/mongodb/models/booking.model";
import { MentorModel } from "../src/infrastructure/database/mongodb/models/mentor.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import logger from "../src/shared/logging/logger";

const backfillMentorSessionStats = async () => {
	try {
		await connectToMongo();

		const mentors = await MentorModel.find({}, { _id: 1 }).lean();

		const completedBookingStats = await BookingModel.aggregate<{
			_id: Types.ObjectId;
			totalSessions: number;
			lastSessionAt: Date;
		}>([
			{
				$match: {
					status: "COMPLETED",
				},
			},
			{
				$group: {
					_id: "$mentorId",
					totalSessions: { $sum: 1 },
					lastSessionAt: { $max: "$endTime" },
				},
			},
		]);

		const statsByMentorId = new Map(
			completedBookingStats.map((stat) => [
				stat._id.toString(),
				{
					totalSessions: stat.totalSessions,
					lastSessionAt: stat.lastSessionAt,
				},
			]),
		);

		const operations = mentors.map((mentor) => {
			const stats = statsByMentorId.get(mentor._id.toString());

			return {
				updateOne: {
					filter: { _id: mentor._id },
					update: {
						$set: {
							totalSessions: stats?.totalSessions ?? 0,
							lastSessionAt: stats?.lastSessionAt ?? null,
						},
					},
				},
			};
		});

		if (operations.length === 0) {
			logger.info("No mentor documents found to backfill.");
			return;
		}

		const result = await MentorModel.bulkWrite(operations);

		logger.info(
			`Backfilled mentor session stats for ${result.modifiedCount ?? 0} mentors.`,
		);
	} catch (error) {
		logger.error(`Error backfilling mentor session stats: ${error}`);
		process.exitCode = 1;
	} finally {
		await disconnectFromMongo();
	}
};

backfillMentorSessionStats();
