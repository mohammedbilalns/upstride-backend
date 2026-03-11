import { AsyncLocalStorage } from "node:async_hooks";

export interface RequestContextData {
	requestId: string;
}

/**
 * RequestContext provides a way to store and retrieve data
 * that is unique to the current request execution context.
 * It uses Node.js AsyncLocalStorage to manage the context.
 */
export class RequestContext {
	private static storage = new AsyncLocalStorage<RequestContextData>();

	/**
	 * Run a function within a new request context.
	 */
	public static run(
		data: RequestContextData,
		next: () => void | Promise<void>,
	) {
		return RequestContext.storage.run(data, next);
	}

	/**
	 * Retrieve the current request context data.
	 */
	public static get(): RequestContextData | undefined {
		return RequestContext.storage.getStore();
	}

	/**
	 * Retrieve the current request ID.
	 */
	public static getRequestId(): string | undefined {
		return RequestContext.get()?.requestId;
	}
}
