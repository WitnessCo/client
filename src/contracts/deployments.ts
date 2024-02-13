import { Address } from "viem";
import { baseSepolia, optimismSepolia, sepolia } from "viem/chains";
import { SupportedChainIdType } from "./utils";

export const witness = {
	[baseSepolia.id]: "0x0000000159C8253802551eEaf8b475db1A50d712",
	[sepolia.id]: "0x00000008bcf12Eeb9E4162687D6D251f0F4e7FC2",
	[optimismSepolia.id]: "0x00000004CB434559f8D052F6E476b677a40c3e93",
} satisfies Record<SupportedChainIdType, Address>;
