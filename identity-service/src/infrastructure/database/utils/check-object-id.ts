import mongoose from "mongoose";
import { AppError } from "../../../application/errors/app-error";
import { ErrorMessageValue, HttpStatus } from "../../../common/enums";

export function checkObjectId(id: string, errorMessage: ErrorMessageValue) {
	if (!mongoose.isValidObjectId(id)) {
		throw new AppError(errorMessage, HttpStatus.NOT_FOUND);
	}
	return id;
}
