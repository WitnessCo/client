import { type Address } from "viem";
import {
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "viem/chains";
import { type SupportedChainIdType } from "./utils";

export const witness = {
  [base.id]: "0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a",
  [mainnet.id]: "0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a",
  [optimism.id]: "0x0000000e143f453f45B2E1cCaDc0f3CE21c2F06a",
  [baseSepolia.id]: "0x0000000159C8253802551eEaf8b475db1A50d712",
  [sepolia.id]: "0x00000008bcf12Eeb9E4162687D6D251f0F4e7FC2",
  [optimismSepolia.id]: "0x0000000a3fa5CFe56b202F376cCa7334c93aEB8b",
  [arbitrumSepolia.id]: "0x00000006399970c8bdad606abD03b1712974E4eA",
} satisfies Record<SupportedChainIdType, Address>;
