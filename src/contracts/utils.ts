import {
	http,
	Address,
	GetContractReturnType,
	PublicClient,
	Transport,
	createPublicClient,
	getContract,
} from "viem";
import {
	type ChainConfig,
	type SupportedChainType,
	supportedChains,
} from "../types/config.js";
import { witness as witnessAbi } from "./abis.js";
import { witnessDeployments } from "./deployments.js";

export const getSupportedChainFromChainId = (chainId: number) => {
	const res = supportedChains.find((c) => c.id === chainId);
	if (!res) throw new Error(`Unsupported chain: ${chainId}`);
	return res satisfies SupportedChainType;
};

export async function getContractFromChainConfig(
	config: ChainConfig,
): Promise<
	GetContractReturnType<
		typeof witnessAbi,
		PublicClient<Transport, SupportedChainType>,
		Address
	>
> {
	const { contract, publicClient, ethRpc } = config;
	if (contract) {
		return contract;
	}
	if (publicClient) {
		return getContract({
			client: publicClient,
			address: witnessDeployments[publicClient.chain.id].address,
			abi: witnessAbi,
		});
	}
	// If we have an ethRpc, we need to create a temporary publicClient to get the chainId
	// to make typescript happy.
	const transport = http(ethRpc, { batch: true });
	const chainId = await createPublicClient({ transport }).getChainId();
	const chain = getSupportedChainFromChainId(chainId);
	const client = createPublicClient({ chain, transport });
	return getContract({
		client,
		address: witnessDeployments[chain.id].address,
		abi: witnessAbi,
	});
}
