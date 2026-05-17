/**
 * Abstract base class for typed HTTP errors.
 * Subclasses set their own statusCode.
 */
export abstract class BaseError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number,
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}
