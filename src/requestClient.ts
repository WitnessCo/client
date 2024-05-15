// Modified from https://github.com/kubb-labs/kubb/blob/main/packages/swagger-client/client.ts.
import axios from "axios";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import type { EndpointType } from "./types/api";

/**
 * Subset of AxiosRequestConfig
 */
type RequestConfigPartial = {
	baseURL?: string;
	url?: string;
	responseType?:
		| "arraybuffer"
		| "blob"
		| "document"
		| "json"
		| "text"
		| "stream";
	signal?: AbortSignal;
	headers?: AxiosRequestConfig["headers"];
	method: "get" | "put" | "patch" | "post" | "delete";
};
type RequestConfig<TData = unknown> =
	| (RequestConfigPartial & { method: "get"; params: TData })
	| (RequestConfigPartial & {
			method: "put" | "patch" | "post" | "delete";
			data: TData;
	  });

/**
 * Subset of AxiosResponse
 */
type ResponseConfig<TData = unknown> = {
	data: TData;
	status: number;
	statusText: string;
	headers?: AxiosResponse["headers"];
};

/**
 * Creates an Axios client with the given base URL and optional auth token.
 *
 * @param baseURL - The base URL for the client.
 * @param authToken - The auth token to use for requests.
 * @returns A function that makes requests against an axios client with the given configuration.
 */
export const createAxiosClient = (
	baseURL: EndpointType,
	authToken?: string,
) => {
	const authHeader = authToken ? { Authorization: `Bearer ${authToken}` } : {};
	const headers = { "User-Agent": "WitnessCo/Client", ...authHeader };
	const axiosInstance = axios.create({ baseURL, headers });
	axiosRetry(axiosInstance, {
		retryCondition: () => true,
		retryDelay: axiosRetry.exponentialDelay,
	});

	async function makeRequest<
		TResponseData,
		TRequestData = unknown,
		TError = unknown,
	>(
		config: RequestConfig<TRequestData>,
	): Promise<ResponseConfig<TResponseData>> {
		return axiosInstance
			.request<TResponseData, ResponseConfig<TResponseData>>(config)
			.catch((e: AxiosError<TError>) => {
				throw e;
			});
	}

	return makeRequest;
};
