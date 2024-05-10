import { http, createPublicClient, getContract } from "viem";
import { base } from "viem/chains";
import { witnessAbi, witnessDeployments } from "./contracts";
import type { ChainConfig, ServerConfig, WitnessContractType } from "./types";

export const DEFAULT_API_URL = "https://api.witness.co" as const;
export const defaultServerConfig = {
	authToken: "",
	chainId: base.id,
	endpoint: DEFAULT_API_URL,
	fetchFn: fetch,
} as const satisfies ServerConfig;

// Defaults to Base for onchain stuff.
const DEFAULT_ETH_RPC_URL =
	"https://base-mainnet.g.alchemy.com/v2/0EArwrcjeLdLrQ9b-3Nac-dktS4LNMDM" as const;
const transport = http(DEFAULT_ETH_RPC_URL, { batch: true });
const client = createPublicClient({
	chain: base,
	transport,
});
const contract: WitnessContractType = getContract({
	client,
	address: witnessDeployments[base.id].address,
	abi: witnessAbi,
});

export const defaultChainConfig = {
	contract,
	ethRpc: undefined,
	publicClient: undefined,
} as const satisfies ChainConfig;
