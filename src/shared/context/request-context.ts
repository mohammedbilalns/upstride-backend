import { AsyncLocalStorage } from "node:async_hooks";

export interface RequestContextData {
	requestId: string;
}

/**
 * Per-request scoped context via AsyncLocalStorage.
 * Allows request-scoped data (e.g. requestId) to be accessible across the
 * async call chain without threading it through every function signature.
 */
export class RequestContext {
	private static _storage = new AsyncLocalStorage<RequestContextData>();

	/**
	 * Run a function within a new request context.
	 */
	public static run(
		data: RequestContextData,
		next: () => void | Promise<void>,
	) {
		return RequestContext._storage.run(data, next);
	}

	/**
	 * Retrieve the current request context data.
	 */
	public static get(): RequestContextData | undefined {
		return RequestContext._storage.getStore();
	}

	/**
	 * Retrieve the current request ID.
	 */
	public static getRequestId(): string | undefined {
		return RequestContext.get()?.requestId;
	}
}
