import logger from "../logging/logger";

interface OutboundFetchOptions {
	service: string; // name of the external service
	url: string; // target url
	init?: RequestInit;
	timeoutMs?: number;
}

const MAX_LOG_BODY_LENGTH = 500;
const DEFAULT_TIMEOUT_MS = 10_000;

export async function fetchWithDiagnostics({
	service,
	url,
	init,
	timeoutMs = DEFAULT_TIMEOUT_MS,
}: OutboundFetchOptions): Promise<Response> {
	const timeoutController = new AbortController();

	// timeout to trigger abort if request exceeds timeout
	const timeoutId = setTimeout(() => {
		timeoutController.abort(
			new Error(`Request timed out after ${timeoutMs}ms`),
		);
	}, timeoutMs);

	const signal = mergeAbortSignals(
		init?.signal ?? undefined,
		timeoutController.signal,
	);

	try {
		const response = await fetch(url, {
			...init,
			signal,
		});

		if (!response.ok) {
			const responseText = await response.text().catch(() => "");
			logger.error({
				msg: `${service} outbound request failed`,
				service,
				url,
				method: init?.method ?? "GET",
				status: response.status,
				statusText: response.statusText,
				timeoutMs,
				responseBody: responseText.slice(0, MAX_LOG_BODY_LENGTH),
			});
		}

		return response;
	} catch (error) {
		logger.error({
			msg: `${service} outbound request threw`,
			service,
			url,
			method: init?.method ?? "GET",
			timeoutMs,
			error,
		});
		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
}

/**
 * Combines two AbortSignals into a single signal.
 */
function mergeAbortSignals(
	primary?: AbortSignal,
	secondary?: AbortSignal,
): AbortSignal | undefined {
	// If only one signal exists , return it
	if (!primary) return secondary;
	if (!secondary) return primary;

	// if one of the signal is aborted return the aborted signal
	if (primary.aborted || secondary.aborted) {
		const controller = new AbortController();
		controller.abort(primary.reason ?? secondary.reason);
		return controller.signal;
	}

	const controller = new AbortController();
	// combine signals if the two of them aborts
	const abort = (event: Event) => {
		const signal = event.target as AbortSignal;
		controller.abort(signal.reason);
		primary.removeEventListener("abort", abort);
		secondary.removeEventListener("abort", abort);
	};

	primary.addEventListener("abort", abort, { once: true });
	secondary.addEventListener("abort", abort, { once: true });
	return controller.signal;
}
