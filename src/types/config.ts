import type {
	Address,
	Chain,
	GetContractReturnType,
	PublicClient,
	Transport,
} from "viem";
import type { witness } from "../contracts/abis";
import type { SupportedChainType } from "../contracts/utils";
import type { EndpointType } from "./api";

/**
 * Configuration options for the server.
 */
export type ServerConfig = {
	authToken?: string;
	chainId?: number;
	endpoint?: EndpointType | string;
};

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

export type WitnessContractType = GetContractReturnType<
	typeof witness,
	PublicClient<Transport, Chain>,
	Address
>;

/**
 * The full configuration options for the client.
 */
export type Config = { chain?: ChainConfig; server?: ServerConfig };
