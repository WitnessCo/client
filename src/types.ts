import type { NormalizeOAS } from "fets";
import type {
	Address,
	Chain,
	GetContractReturnType,
	PublicClient,
	Transport,
} from "viem";
import type { SupportedChainType, witnessAbi } from "./contracts";
import type openapi from "./openapi";

/** @internal */
export type OpenapiConfigType = NormalizeOAS<typeof openapi>;

/** @internal */
export type EndpointType = OpenapiConfigType["servers"][number]["url"];

/** @internal */
export interface CheckpointResponse {
	chainId: number;
	txHash: string;
	status: "pending" | "included" | "finalized";
	rootHash: string;
	treeSize: string;
	blockNumber: string;
	blockHash: string;
	timestamp: string;
}

/**
 * Configuration options for the server.
 */
export type ServerConfig = {
	authToken?: string;
	chainId?: number;
	endpoint?: EndpointType | string;
	fetchFn?: typeof fetch;
};

export type WitnessContractType = GetContractReturnType<
	typeof witnessAbi,
	PublicClient<Transport, Chain>,
	Address
>;

/**
 * Represents the configuration options for the chain.
 */
export type ChainConfig =
	| {
			contract: undefined;
			publicClient: undefined;
			ethRpc: string;
	  }
	| {
			contract: undefined;
			publicClient: PublicClient<Transport, SupportedChainType>;
			ethRpc: undefined;
	  }
	| {
			contract: WitnessContractType;
			publicClient: undefined;
			ethRpc: undefined;
	  };

export type Config = { chain?: ChainConfig; server?: ServerConfig };
