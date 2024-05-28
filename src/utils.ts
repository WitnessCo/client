import { type Hash, isHash } from "viem";

/**
 * Typescript helper for coercing strings to hashes.
 */
export function strToHash(str: string): Hash {
	if (!isHash(str)) throw new Error(`${str} is not a valid hash`);
	return str;
}

/**
 * Typescript helper for coercing string arrays to hash arrays.
 */
export function strArrToHash(strs: string[]): Hash[] {
	return strs.map(strToHash);
}

/**
 * Helper method that wraps the fetch function and handles retry logic.
 *
 * @param url - The URL to fetch.
 * @param options - The options for the fetch request.
 * @returns A promise that resolves to the response data.
 */
export const fetchHelper = async (
	url: string,
	options: RequestInit,
): Promise<unknown> => {
	const maxRetries = 4;
	const errors = [];
	while (true) {
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error(
					`HTTP Error ${response.status}: ${response.statusText}`,
				);
			}
			return await response.json();
		} catch (e) {
			errors.push(e);
			if (errors.length >= maxRetries) {
				break;
			}
			// Wait before retrying.
			// Exponential backoff with a max of (2 ** maxRetries) * 250ms === 4s.
			const delayMs = 2 ** errors.length * 250;
			await delay(delayMs);
		}
	}
	throw new Error(
		`Aggregate HTTP Error after ${maxRetries} retries:\n${errors.join(",\n")}`,
	);
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
