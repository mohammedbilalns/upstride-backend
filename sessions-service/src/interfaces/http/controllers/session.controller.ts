import { HttpStatus, ResponseMessage } from "../../../common/enums";
import asyncHandler from "../utils/asyncHandler";

export class SessionController {
	bookSession = asyncHandler((_req, res) => {
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SESSION_INITIATED });
	});

	cancelBooking = asyncHandler((_req, res) => {
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.CANCELLED_BOOKING });
	});

	initiateSession = asyncHandler((_req, res) => {
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.SESSION_INITIATED });
	});

	markSessionAsComplete = asyncHandler((_req, res) => {
		res.status(HttpStatus.OK).json({
			success: true,
			message: ResponseMessage.MARKED_SESSION_AS_COMPLETE,
		});
	});
}
