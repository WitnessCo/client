import { type Address } from "viem";
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
import { type SupportedChainIdType } from "./utils";

export type DeploymentEntry = {
	address: Address;
	startBlock: number;
};

export const witnessDeployments = {
	[base.id]: {
		address: "0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a",
		startBlock: 10576562,
	},
	[mainnet.id]: {
		address: "0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a",
		startBlock: 19228593,
	},
	[optimism.id]: {
		address: "0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a",
		startBlock: 116171910,
	},
	[baseSepolia.id]: {
		address: "0x0000000159C8253802551eEaf8b475db1A50d712",
		startBlock: 6048293,
	},
	[sepolia.id]: {
		address: "0x00000008bcf12Eeb9E4162687D6D251f0F4e7FC2",
		startBlock: 5282847,
	},
	[optimismSepolia.id]: {
		address: "0x0000000a3fa5CFe56b202F376cCa7334c93aEB8b",
		startBlock: 8043289,
	},
	[arbitrumSepolia.id]: {
		address: "0x00000006399970c8bdad606abD03b1712974E4eA",
		startBlock: 31706016,
	},
	[gnosisChiado.id]: {
		address: "0x000000031C0d9df77F390CED953219E561B67089",
		startBlock: 9299836,
	},
} satisfies Record<SupportedChainIdType, DeploymentEntry>;
