import type { EndpointType } from "./types/api.js";
import { fetchHelper } from "./utils.js";

/**
 * Creates a request client with the given base URL and optional auth token.
 *
 * @param baseURL - The base URL for the client.
 * @param authToken - The auth token to use for requests.
 * @returns A function that makes requests against a request client with the given configuration.
 */
export const createRequestClient = (
	baseURL: EndpointType,
	authToken?: string,
) => {
	const authHeader = authToken
		? { Authorization: `Bearer ${authToken}` }
		: undefined;

	async function makeRequest<
		TResponseData,
		TRequestData extends TRequestArgs = Record<string, never>,
	>(config: RequestConfig<TRequestData>): Promise<TResponseData> {
		const { method, url, signal, headers: customHeaders } = config;
		let body: string | undefined;
		const requestUrl = new URL(url, baseURL);

		if (method === "get" && config.params) {
			for (const [key, value] of Object.entries(config.params)) {
				if (value !== undefined) {
					requestUrl.searchParams.append(key, value.toString());
				}
			}
		} else if (method !== "get" && config.data) {
			body = JSON.stringify(config.data);
		}
		const data = await fetchHelper(requestUrl.toString(), {
			method,
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "WitnessCo/Client",
				...authHeader,
				...customHeaders,
			},
			signal,
			body,
		});
		return data as TResponseData;
	}

	return makeRequest;
};

type TRequestArgs = Record<string, string | string[] | number> | undefined;
type RequestConfigPartial = {
	url: string;
	signal?: AbortSignal;
	headers?: Record<string, string>;
	method: "get" | "put" | "patch" | "post" | "delete";
};
type RequestConfig<TData extends TRequestArgs> =
	| (RequestConfigPartial & { method: "get"; params?: TData })
	| (RequestConfigPartial & {
			method: "put" | "patch" | "post" | "delete";
			data?: TData;
	  });
