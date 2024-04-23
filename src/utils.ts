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
