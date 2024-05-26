import type {
	Address,
	Chain,
	GetContractReturnType,
	PublicClient,
	Transport,
} from "viem";
import {
	arbitrumSepolia,
	base,
	baseSepolia,
	gnosisChiado,
	mainnet,
	optimism,
	optimismSepolia,
	sepolia,
} from "viem/chains";
import type { witness } from "../contracts/abis.js";
import type { EndpointType } from "./api.js";

export const supportedChains = [
	base,
	mainnet,
	optimism,
	baseSepolia,
	sepolia,
	optimismSepolia,
	arbitrumSepolia,
	gnosisChiado,
] as const;

export type SupportedChainType = (typeof supportedChains)[number];
export type SupportedChainIdType = SupportedChainType["id"];

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
