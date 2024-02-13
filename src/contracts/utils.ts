import { baseSepolia, optimismSepolia, sepolia } from "viem/chains";

export const supportedChains = [baseSepolia, sepolia, optimismSepolia] as const;

export type SupportedChainType = (typeof supportedChains)[number];

export const supportedChainIds = supportedChains.map((c) => c.id);
export type SupportedChainIdType = (typeof supportedChainIds)[number];

export const getSupportedChainFromChainId = (chainId: number) => {
	const res = supportedChains.find((c) => c.id === chainId);
	if (!res) throw new Error(`Unsupported chain: ${chainId}`);
	return res satisfies SupportedChainType;
};