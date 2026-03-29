import { NotFoundError } from "./not-found-error";

export class SlotNotFoundError extends NotFoundError {
	constructor(message = "Slot not found") {
		super(message);
	}
}
